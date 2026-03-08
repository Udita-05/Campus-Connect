import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import { calculateJobMatch } from '../utils/matching.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // --- Placement Policy Checks ---
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile && profile.isPlaced) {
      // Logic: Tier 1 selection blocks everything. 
      // Tier 2 selection allows applying to Tier 1 ONLY.
      // Tier 3 selection allows Tier 1 and Tier 2.
      if (profile.placedTier === 1) {
        return res.status(403).json({ message: 'Placement Policy: You are already placed in a Tier 1 company and cannot apply further.' });
      }
      if (profile.placedTier === 2 && job.tier >= 2) {
        return res.status(403).json({ message: 'Placement Policy: You are placed in a Tier 2 company. You can only apply to Tier 1 companies.' });
      }
      if (profile.placedTier === 3 && job.tier >= 3) {
        return res.status(403).json({ message: 'Placement Policy: You are placed in a Tier 3 company. You can only apply to Tier 1 or Tier 2 companies.' });
      }
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
      statusHistory: [{ status: 'Applied' }]
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'title companyName type location tier')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For recruiter: get applications for a specific job they posted
// Returns applications enriched with full StudentProfile data
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'student',
        select: 'name email',
      })
      .sort({ createdAt: -1 });

    // Enrich each application with full StudentProfile data and Match Score
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        if (app.student?._id) {
          const profile = await StudentProfile.findOne({ user: app.student._id }).lean();
          appObj.studentProfile = profile || {};

          // Use the unified matching utility
          const matchedJob = calculateJobMatch(job, profile);
          appObj.matchScore = matchedJob.matchScore;
          appObj.isEligible = matchedJob.isEligible;
        } else {
          appObj.studentProfile = {};
          appObj.matchScore = 0;
          appObj.isEligible = false;
        }
        return appObj;
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For recruiter: get full profile of a specific student (by studentId = User _id)
export const getStudentProfileForRecruiter = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [profile, user] = await Promise.all([
      StudentProfile.findOne({ user: studentId }).lean(),
      User.findById(studentId).select('name email').lean(),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ ...profile, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ppoOffered } = req.body;

    const application = await Application.findById(id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify recruiter owns this job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    if (status !== undefined) {
      application.status = status;
      application.statusHistory.push({ status });

      // If status is "Selected", update StudentProfile placement status
      if (status === 'Selected') {
        await StudentProfile.findOneAndUpdate(
          { user: application.student },
          {
            isPlaced: true,
            placedTier: application.job.tier
          }
        );
      }
    }

    if (ppoOffered !== undefined) {
      application.ppoOffered = ppoOffered;
      if (ppoOffered) {
        application.status = 'Selected';
        application.statusHistory.push({ status: 'PPO Offered' });
        await StudentProfile.findOneAndUpdate(
          { user: application.student },
          {
            isPlaced: true,
            placedTier: application.job.tier,
            hasPPO: true
          }
        );
      }
    }

    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Admin: get all applications across all jobs
export const getAllApplicationsForAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title companyName')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // Enrich with student profile (branch, cgpa, etc.)
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        const profile = await StudentProfile.findOne({ user: app.student._id }).lean();
        appObj.studentProfile = profile || {};
        return appObj;
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Admin: update placement procedure timings
export const updateApplicationProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const { oaDateTime, gdDateTime, interviewDateTime, locationOrLink, status } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (oaDateTime !== undefined) application.oaDateTime = oaDateTime;
    if (gdDateTime !== undefined) application.gdDateTime = gdDateTime;
    if (interviewDateTime !== undefined) application.interviewDateTime = interviewDateTime;
    if (locationOrLink !== undefined) application.locationOrLink = locationOrLink;
    if (status !== undefined) application.status = status;

    const updated = await application.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
