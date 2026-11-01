import { Router } from 'express';
import { DepositController } from '../controllers/depositController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/checkout', authenticate, requireRole(['ORGANIZATION']), DepositController.checkoutDeposit);
router.post('/:depositId/confirm', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), DepositController.confirmPayment);
router.get('/status', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), DepositController.getDepositStatus);
router.post('/:id/refund-request', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), DepositController.requestRefund);

export default router;

