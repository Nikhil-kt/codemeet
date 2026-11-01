import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// QR and Special Code Generation (both route variants supported)
router.post('/generate-qr', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), AttendanceController.generateToken);
router.post('/events/:eventId/attendance-token', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), AttendanceController.generateToken);

// Attendance Check-In (both route variants supported)
router.post('/checkin', authenticate, requireRole(['VOLUNTEER']), AttendanceController.checkIn);
router.post('/check-in', authenticate, requireRole(['VOLUNTEER']), AttendanceController.checkIn);

// Certificates & Commendations
router.get('/certificates/my', authenticate, AttendanceController.getMyCertificates);
router.get('/events/:eventId/certificate', authenticate, AttendanceController.getEventCertificate);

// Organizer Event Attendance Roster
router.get('/events/:eventId', authenticate, requireRole(['ORGANIZATION', 'ADMIN']), AttendanceController.getEventAttendance);

export default router;

