import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Enforce ADMIN role across all admin routes
router.use(authenticate, requireRole(['ADMIN']));

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/organizations', AdminController.listOrganizations);
router.post('/organizations/:id/review', AdminController.reviewOrganization);
router.get('/events', AdminController.listEvents);
router.post('/events/:id/review', AdminController.reviewEvent);
router.get('/audit-logs', AdminController.getAuditLogs);
router.get('/gemini-status', AdminController.checkGeminiStatus);

export default router;

