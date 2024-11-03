import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authValidators } from '../validators/auth.validator';
import prisma from '../../lib/prisma';

const router = Router();

const authController = new AuthController(prisma);

router.post('/login', authValidators.login, authController.login);
router.post('/signup', authValidators.signup, authController.signup);

export default router;
