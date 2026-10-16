import { createHash } from 'node:crypto';
import User from '../model/user.model.js';

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : '';
  if (!token) return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  try {
    const sessionTokenHash = createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ sessionTokenHash }).select('_id name email');
    if (!user) return res.status(401).json({ success: false, message: 'Your session is invalid. Please sign in again.' });
    req.user = user;
    req.sessionTokenHash = sessionTokenHash;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unable to verify your session.' });
  }
};
