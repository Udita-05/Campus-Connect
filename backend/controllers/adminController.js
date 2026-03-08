import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all jobs (including pending)
export const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name email');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or reject a job
export const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({ message: `Job ${status} successfully`, job });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get platform statistics
export const getAdminStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    const placedStudents = await StudentProfile.countDocuments({ isPlaced: true });
    const ppoOffers = await Application.countDocuments({ ppoOffered: true });

    res.json({
      students: studentCount,
      recruiters: recruiterCount,
      jobs: jobCount,
      applications: applicationCount,
      placedStudents,
      ppoOffers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
