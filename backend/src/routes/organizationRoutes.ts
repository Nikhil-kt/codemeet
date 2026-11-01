import { Router } from 'express';
import { OrganizationController } from '../controllers/organizationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/me', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), OrganizationController.getMyOrg);
router.put('/me', authenticate, requireRole(['ORGANIZATION']), OrganizationController.updateMyOrg);
router.post('/documents', authenticate, requireRole(['ORGANIZATION']), OrganizationController.uploadDocument);
router.get('/stats', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), OrganizationController.getDashboardStats);

export default router;

