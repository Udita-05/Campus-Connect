import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college: { type: String },
  branch: { type: String },
  cgpa: { type: Number },
  skills: [{ type: String }],
  projects: [{ title: String, description: String, link: String }],
  resumeLink: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  about: { type: String, default: '' },
  linkedIn: { type: String, default: '' },
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    description: String,
    current: { type: Boolean, default: false }
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startYear: String,
    endYear: String,
    grade: String
  }],
  achievements: [{
    title: String,
    date: Date,
    description: String
  }],
  isPlaced: { type: Boolean, default: false },
  placedTier: { type: Number, default: null },
  hasPPO: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Calculate Profile Strength
studentProfileSchema.virtual('profileStrength').get(function () {
  let score = 0;
  if (this.profilePhoto && this.profilePhoto.trim() !== '') score += 20;
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.projects && this.projects.length > 0) score += 20;
  if (this.resumeLink && this.resumeLink.trim() !== '') score += 20;
  if (this.about && this.about.trim() !== '') score += 20;
  return score;
});

export default mongoose.model('StudentProfile', studentProfileSchema);
