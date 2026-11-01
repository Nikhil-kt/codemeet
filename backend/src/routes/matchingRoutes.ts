import { Router } from 'express';
import { MatchingController } from '../controllers/matchingController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/events/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.matchVolunteersForEvent);
router.post('/events/:eventId/notify', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.notifyMatchedVolunteers);

export default router;

