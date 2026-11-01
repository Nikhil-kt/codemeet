import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', authenticate, AuthController.resetPassword);
router.post('/resend-verification', AuthController.resendVerification);
router.get('/me', authenticate, AuthController.me);

export default router;
