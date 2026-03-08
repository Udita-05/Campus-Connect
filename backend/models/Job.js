import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  stipendOrSalary: { type: String },
  location: { type: String },
  type: { type: String, enum: ['Internship', 'Full-time'], default: 'Internship' },
  minCGPA: { type: Number, default: 0 },
  allowedBranches: [{ type: String }],
  tier: { type: Number, enum: [1, 2, 3], default: 3 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
