import { Router } from 'express';
import { currentUser, login, logout, register } from '../controller/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', requireAuth, currentUser);
authRouter.post('/logout', requireAuth, logout);
export default authRouter;
