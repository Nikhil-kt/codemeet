import { Router } from 'express';
import { MatchingController } from '../controllers/matchingController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Support both plural and singular routes, and both POST and GET
router.post('/events/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.matchVolunteersForEvent);
router.get('/events/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.matchVolunteersForEvent);
router.post('/event/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.matchVolunteersForEvent);
router.get('/event/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.matchVolunteersForEvent);

router.post('/events/:eventId/notify', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.notifyMatchedVolunteers);
router.post('/event/:eventId/notify', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), MatchingController.notifyMatchedVolunteers);

export default router;

