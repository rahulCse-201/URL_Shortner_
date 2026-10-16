import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import User from '../model/user.model.js';

const scrypt = promisify(scryptCallback);
const hashPassword = async (password) => {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString('base64url')}.${key.toString('base64url')}`;
};
const verifyPassword = async (password, value) => {
  const [salt, hash] = value.split('.');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scrypt(password, Buffer.from(salt, 'base64url'), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
const makeSession = () => {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: createHash('sha256').update(token).digest('hex') };
};
const responseUser = (user) => ({ id: user._id, name: user.name, email: user.email });

export const register = async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  if (name.length > 80) return res.status(400).json({ success: false, message: 'Name must be 80 characters or fewer.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  try {
    const session = makeSession();
    const user = await User.create({ name, email, password: await hashPassword(password), sessionTokenHash: session.hash });
    return res.status(201).json({ success: true, token: session.token, user: responseUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    return res.status(500).json({ success: false, message: 'Unable to create your account right now.' });
  }
};

export const login = async (req, res) => {
  const body = req.body || {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await verifyPassword(password, user.password))) return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    const session = makeSession();
    user.sessionTokenHash = session.hash;
    await user.save();
    return res.json({ success: true, token: session.token, user: responseUser(user) });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to sign in right now.' });
  }
};

export const currentUser = (req, res) => {
  return res.json({ success: true, user: responseUser(req.user) });
};

export const logout = async (req, res) => {
  try {
    const revokedSessionHash = createHash('sha256').update(randomBytes(32)).digest('hex');
    await User.updateOne(
      { _id: req.user._id, sessionTokenHash: req.sessionTokenHash },
      { $set: { sessionTokenHash: revokedSessionHash } },
    );
    return res.json({ success: true, message: 'Signed out successfully.' });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to sign out right now.' });
  }
};
