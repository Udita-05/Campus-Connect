import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('RecruiterProfile', recruiterProfileSchema);
