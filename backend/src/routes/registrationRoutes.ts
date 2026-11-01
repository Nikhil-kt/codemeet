import { Router } from 'express';
import { RegistrationController } from '../controllers/registrationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/events/:eventId/register', authenticate, requireRole(['VOLUNTEER']), RegistrationController.registerForEvent);
router.post('/:id/cancel', authenticate, RegistrationController.cancelRegistration);
router.get('/events/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), RegistrationController.getEventRegistrations);

export default router;

