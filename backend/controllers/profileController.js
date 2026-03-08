import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';

export const getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const {
      college, branch, cgpa, skills, projects, resumeLink,
      about, profilePhoto, linkedIn, experience, education, achievements
    } = req.body;
    console.log(`[ProfileUpdate] User: ${req.user._id}`);
    console.log(`[ProfileUpdate] Data:`, JSON.stringify(req.body, null, 2));
    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user._id,
        college, branch, cgpa, skills, projects, resumeLink,
        about, profilePhoto, linkedIn, experience, education, achievements
      });
      return res.status(201).json(profile);
    }

    // Use explicit undefined checks so that sending an empty string clears the field
    if (college !== undefined) profile.college = college;
    if (branch !== undefined) profile.branch = branch;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (skills !== undefined) profile.skills = skills;
    if (projects !== undefined) profile.projects = projects;
    if (resumeLink !== undefined) profile.resumeLink = resumeLink;
    if (about !== undefined) profile.about = about;
    if (profilePhoto !== undefined) profile.profilePhoto = profilePhoto;
    if (linkedIn !== undefined) profile.linkedIn = linkedIn;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (achievements !== undefined) profile.achievements = achievements;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecruiterProfile = async (req, res) => {
  try {
    const { companyName, description } = req.body;
    let profile = await RecruiterProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await RecruiterProfile.create({
        user: req.user._id, companyName, description
      });
      return res.status(201).json(profile);
    }

    if (companyName !== undefined) profile.companyName = companyName;
    if (description !== undefined) profile.description = description;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
