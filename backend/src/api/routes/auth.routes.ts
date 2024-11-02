import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authValidators } from '../../utils/auth.validator';
const router = Router();

router.post('/login', authValidators.login, authController.login);
router.post('/signup', authValidators.signup, authController.signup);

export default router;
