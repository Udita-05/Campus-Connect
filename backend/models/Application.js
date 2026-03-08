import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  oaDateTime: { type: Date },
  gdDateTime: { type: Date },
  interviewDateTime: { type: Date },
  locationOrLink: { type: String },
  ppoOffered: { type: Boolean, default: false },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
