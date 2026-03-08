import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import { calculateJobMatch } from '../utils/matching.js';

export const createJob = async (req, res) => {
  try {
    const { companyName, title, description, requirements, stipendOrSalary, location, type, minCGPA, allowedBranches, tier } = req.body;

    const job = await Job.create({
      recruiter: req.user._id,
      companyName,
      title,
      description,
      requirements,
      stipendOrSalary,
      location,
      type,
      minCGPA: minCGPA || 0,
      allowedBranches: allowedBranches || [],
      tier: tier || 3,
      status: 'approved'
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved' }).sort({ createdAt: -1 });

    if (req.user && req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id });

      if (profile) {
        const enrichedJobs = jobs.map(job => calculateJobMatch(job, profile));
        return res.json(enrichedJobs);
      }
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (req.user && req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        return res.json(calculateJobMatch(job, profile));
      }
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecruiterPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    let job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const {
      title, description, requirements, stipendOrSalary,
      location, type, minCGPA, allowedBranches, tier
    } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;
    if (stipendOrSalary !== undefined) job.stipendOrSalary = stipendOrSalary;
    if (location !== undefined) job.location = location;
    if (type !== undefined) job.type = type;
    if (minCGPA !== undefined) job.minCGPA = minCGPA;
    if (allowedBranches !== undefined) job.allowedBranches = allowedBranches;
    if (tier !== undefined) job.tier = tier;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
