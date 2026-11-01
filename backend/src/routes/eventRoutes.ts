import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { RegistrationController } from '../controllers/registrationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', EventController.listEvents);
router.get('/:id', EventController.getEventDetails);
router.get('/:eventId/volunteers', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), RegistrationController.getEventRegistrations);
router.get('/:eventId/registrations', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), RegistrationController.getEventRegistrations);
router.post('/', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), EventController.createEvent);
router.post('/:id/submit', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), EventController.submitEventForApproval);

// Volunteer event registration endpoints
router.post('/:eventId/register', authenticate, requireRole(['VOLUNTEER', 'TEAM_LEADER']), RegistrationController.registerForEvent);
router.delete('/:eventId/register', authenticate, requireRole(['VOLUNTEER', 'TEAM_LEADER']), RegistrationController.cancelRegistration);

export default router;

