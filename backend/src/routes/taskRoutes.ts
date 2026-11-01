import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/events/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), TaskController.createTask);
router.get('/events/:eventId', authenticate, TaskController.getTasksForEvent);
router.post('/:id/submit', authenticate, requireRole(['VOLUNTEER']), TaskController.submitEvidence);
router.post('/submissions/:id/review', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), TaskController.reviewSubmission);

export default router;

