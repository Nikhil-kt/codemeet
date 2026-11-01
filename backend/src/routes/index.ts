import { Router } from 'express';
import authRoutes from './authRoutes';
import volunteerRoutes from './volunteerRoutes';
import organizationRoutes from './organizationRoutes';
import eventRoutes from './eventRoutes';
import matchingRoutes from './matchingRoutes';
import registrationRoutes from './registrationRoutes';
import attendanceRoutes from './attendanceRoutes';
import taskRoutes from './taskRoutes';
import depositRoutes from './depositRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/organizations', organizationRoutes);
router.use('/events', eventRoutes);
router.use('/matching', matchingRoutes);
router.use('/registrations', registrationRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/tasks', taskRoutes);
router.use('/deposits', depositRoutes);
router.use('/admin', adminRoutes);

export default router;

