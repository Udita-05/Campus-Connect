import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Briefcase, IndianRupee, Clock, Building, Zap,
  CheckCircle, X, ChevronRight, FileText, Star
} from 'lucide-react';

/* ─── Job Detail Modal ─────────────────────────────────── */
const JobDetailModal = ({ job, onClose, onApply, isStudent, hasApplied }) => {
  const matchScore = job.matchScore ?? 0;
  const isEligible = job.isEligible !== false; // Default to true for recruiters/unknown
  const missing = job.missingRequirements || {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(10,10,30,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ border: '1px solid rgba(139,92,246,0.25)', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient header */}
          <div className="h-24 rounded-t-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X size={18} />
            </button>
            {/* Match badge */}
            {isStudent && (
              <div className={`absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
                ${matchScore >= 75 ? 'bg-emerald-500 text-white' :
                  matchScore >= 40 ? 'bg-amber-400 text-white' :
                    'bg-white/20 text-white'}`}>
                <Zap size={12} fill="currentColor" /> {matchScore}% Match
              </div>
            )}
          </div>

          <div className="px-6 pt-5 pb-6 space-y-5">
            {/* Eligibility Banner */}
            {isStudent && !isEligible && (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest mb-1">
                  <X size={14} /> Academic Ineligibility
                </div>
                <p className="text-xs text-rose-500 font-medium">
                  You don't meet the requirements for this role:
                  {missing.cgpa && <span> • Min CGPA: {job.minCGPA}</span>}
                  {missing.branch && <span> • Allowed Branches: {job.allowedBranches?.join(', ')}</span>}
                </p>
              </div>
            )}

            {/* Title & company */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{job.title}</h2>
              <div className="flex items-center gap-2 mt-1.5 text-violet-600 dark:text-violet-400 font-semibold text-sm">
                <Building size={15} /> {job.companyName}
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 text-sm">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs
                ${job.tier === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                  job.tier === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                <Star size={13} fill="currentColor" /> Tier {job.tier}
              </div>
              <Chip icon={<Briefcase size={13} />} text={job.type} />
              <Chip icon={<MapPin size={13} />} text={job.location || 'Remote'} />
              {job.stipendOrSalary && <Chip icon={<IndianRupee size={13} />} text={job.stipendOrSalary} />}
              <Chip icon={<Clock size={13} />} text={`Posted ${new Date(job.createdAt).toLocaleDateString()}`} />
            </div>

            {/* Description */}
            <div>
              <SectionLabel icon={<FileText size={14} />} text="About This Role" />
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap mt-2">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div>
                <SectionLabel icon={<Star size={14} />} text="Required Skills" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.requirements.map((req, i) => (
                    <span key={i}
                      className="px-3 py-1 rounded-full text-xs font-semibold border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {isStudent && (
              <div className="pt-2">
                {hasApplied ? (
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20
                    text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle size={18} /> Application Submitted
                  </div>
                ) : (
                  <button
                    onClick={() => { if (isEligible) { onApply(job._id); onClose(); } }}
                    disabled={!isEligible}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white
                      transition-all duration-200 ${isEligible ? 'hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-95 bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'}`}
                  >
                    {isEligible ? 'Apply Now' : 'Ineligible to Apply'} <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Chip = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg font-medium text-xs">
    {icon} {text}
  </div>
);

const SectionLabel = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400">
    {icon} {text}
  </div>
);

/* ─── Job Card ─────────────────────────────────────────── */
const JobCard = ({ job, onApply, isStudent, hasApplied }) => {
  const [showDetail, setShowDetail] = useState(false);
  const matchScore = job.matchScore ?? 0;
  const isEligible = job.isEligible !== false;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border
          overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer
          ${!isEligible && isStudent ? 'opacity-75 grayscale-[0.3]' : 'hover:shadow-violet-100/50 dark:hover:shadow-violet-900/20'}
          ${isEligible ? 'border-slate-200/60 dark:border-slate-800/60' : 'border-rose-200 dark:border-rose-900/50'}`}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        onClick={() => setShowDetail(true)}
      >
        {/* Top accent line */}
        <div className={`h-1.5 ${isEligible ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500' : 'bg-rose-500'}`} />

        <div className="p-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight
              group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {job.title}
            </h3>
            {isStudent && (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex gap-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                    ${job.tier === 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                    Tier {job.tier}
                  </span>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${matchScore >= 75 ? 'bg-emerald-500 text-white' :
                    matchScore >= 40 ? 'bg-amber-400 text-white' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                    <Zap size={10} fill="currentColor" /> {matchScore}% Match
                  </div>
                </div>
                {!isEligible && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-md uppercase tracking-tighter">Ineligible</span>
                )}
              </div>
            )}
          </div>

          {/* Company */}
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-4 uppercase tracking-wide">
            <Building size={14} /> {job.companyName}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-xs mb-4">
            <Chip icon={<Briefcase size={11} />} text={job.type} />
            <Chip icon={<MapPin size={11} />} text={job.location || 'Remote'} />
            {job.stipendOrSalary && <Chip icon={<IndianRupee size={11} />} text={job.stipendOrSalary} />}
          </div>

          {/* Description snippet */}
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
            {job.description}
          </p>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-1.5">
            {job.requirements?.slice(0, 3).map((skill, i) => (
              <span key={i}
                className="px-2.5 py-1 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400
                  text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-800">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {isStudent && (
              hasApplied ? (
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest
                  bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
                  <CheckCircle size={12} /> Submitted
                </span>
              ) : (
                <button
                  onClick={() => { if (isEligible) onApply(job._id); }}
                  disabled={!isEligible}
                  className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all
                     ${isEligible ? 'bg-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                >
                  {isEligible ? 'Apply' : 'Ineligible'}
                </button>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Detail modal */}
      {showDetail && (
        <JobDetailModal
          job={job}
          onClose={() => setShowDetail(false)}
          onApply={onApply}
          isStudent={isStudent}
          hasApplied={hasApplied}
        />
      )}
    </>
  );
};

export default JobCard;
