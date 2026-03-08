import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { createJob, getJobs, getJobById, getRecruiterPostedJobs, updateJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
  .get(protect, getJobs)
  .post(protect, authorizeRoles('recruiter'), createJob);

router.get('/recruiter', protect, authorizeRoles('recruiter'), getRecruiterPostedJobs);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, authorizeRoles('recruiter'), updateJob)
  .delete(protect, authorizeRoles('recruiter'), deleteJob);

export default router;
