import express from 'express';
import { getAllUsers, getAllJobsForAdmin, updateJobStatus, getAdminStats } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All admin routes must be protected and restricted to 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/jobs', getAllJobsForAdmin);
router.put('/jobs/:id/status', updateJobStatus);
router.get('/stats', getAdminStats);

export default router;
