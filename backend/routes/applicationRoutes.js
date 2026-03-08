import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  applyForJob,
  getStudentApplications,
  getJobApplications,
  getStudentProfileForRecruiter,
  updateApplicationStatus,
  getAllApplicationsForAdmin,
  updateApplicationProcedure
} from '../controllers/applicationController.js';

const router = express.Router();

// Student routes
router.post('/apply', protect, authorizeRoles('student'), applyForJob);
router.get('/my-applications', protect, authorizeRoles('student'), getStudentApplications);

// Recruiter routes
router.get('/job/:jobId', protect, authorizeRoles('recruiter'), getJobApplications);
router.get('/student-profile/:studentId', protect, authorizeRoles('recruiter'), getStudentProfileForRecruiter);
router.put('/:id/status', protect, authorizeRoles('recruiter'), updateApplicationStatus);

// Admin routes
router.get('/admin/all', protect, authorizeRoles('admin'), getAllApplicationsForAdmin);
router.put('/admin/:id/procedure', protect, authorizeRoles('admin'), updateApplicationProcedure);

export default router;
