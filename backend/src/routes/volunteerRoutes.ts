import { Router } from 'express';
import { VolunteerController } from '../controllers/volunteerController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/profile', authenticate, VolunteerController.getMyProfile);
router.get('/me', authenticate, VolunteerController.getMyProfile);
router.put('/profile', authenticate, VolunteerController.updateProfile);
router.put('/me', authenticate, VolunteerController.updateProfile);
router.post('/skills', authenticate, VolunteerController.setSkills);
router.post('/availability', authenticate, VolunteerController.setAvailability);
router.get('/history', authenticate, VolunteerController.getHistory);
router.get('/skills-catalog', VolunteerController.getSkillsCatalog);

export default router;

