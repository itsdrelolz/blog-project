import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authValidators } from '../validators/auth.validator';
import prisma from '../../lib/prisma';
import { authMiddleware } from '../middlewares/auth.middleware';
import { loginLimiter } from '../middlewares/ratelimiter.middleware';
const router = Router();

const authController = new AuthController(prisma);

router.post('/login', loginLimiter, authValidators.login, authController.login);
router.post('/signup', authValidators.signup, authController.signup);
router.get('/me', authMiddleware, authController.me);

export default router;
