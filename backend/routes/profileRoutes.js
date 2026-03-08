import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { 
  getStudentProfile, 
  updateStudentProfile, 
  getRecruiterProfile, 
  updateRecruiterProfile 
} from '../controllers/profileController.js';

const router = express.Router();

router.route('/student')
  .get(protect, authorizeRoles('student'), getStudentProfile)
  .put(protect, authorizeRoles('student'), updateStudentProfile);

router.route('/recruiter')
  .get(protect, authorizeRoles('recruiter'), getRecruiterProfile)
  .put(protect, authorizeRoles('recruiter'), updateRecruiterProfile);

export default router;
