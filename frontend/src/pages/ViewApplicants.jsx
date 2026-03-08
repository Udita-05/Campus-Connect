import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, GraduationCap, ArrowLeft, X, Download, User,
  Code2, BookOpen, Star, ExternalLink, FileText, Briefcase, ChevronRight, Award, Zap, AlertCircle, Filter, SortAsc, SortDesc
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────── */
const Avatar = ({ src, name, size = 'md' }) => {
  const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-14 h-14 text-xl';
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${dim} rounded-full object-cover ring-4 ring-violet-200 dark:ring-violet-800/40 shadow-lg`}
      />
    );
  }
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <div className={`${dim} rounded-full flex items-center justify-center font-bold
      bg-gradient-to-br from-violet-500 to-indigo-600 text-white ring-4
      ring-violet-200 dark:ring-violet-800/40 shadow-lg`}>
      {initials}
    </div>
  );
};

const SkillBadge = ({ skill }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
    bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300
    border border-violet-200/60 dark:border-violet-700/40">
    {skill}
  </span>
);

const StatusBadge = ({ status }) => {
  const map = {
    'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200/50 dark:border-blue-700/40',
    'Under Review': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-700/40',
    'Shortlisted': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200/50 dark:border-violet-700/40',
    'Interview': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-700/40',
    'Selected': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-700/40',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200/50 dark:border-red-700/40',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${map[status] || map['Applied']}`}>
      {status}
    </span>
  );
};

/* ─── Full Profile Modal ───────────────────────────────── */
const FullProfileModal = ({ candidate, onClose }) => {
  const { student, studentProfile, status } = candidate;
  const p = studentProfile || {};

  const handleDownload = () => {
    if (!p.resumeLink) return;
    const a = document.createElement('a');
    a.href = p.resumeLink;
    a.download = `${student?.name || 'resume'}_resume`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(10, 10, 30, 0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ border: '1px solid rgba(139,92,246,0.25)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header gradient band */}
          <div className="h-32 rounded-t-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Profile photo overlapping the band */}
          <div className="px-8 -mt-14 flex items-end justify-between mb-6 relative z-10">
            <div className="p-1.5 bg-white dark:bg-slate-900 rounded-full shadow-xl">
              <Avatar src={p.profilePhoto} name={student?.name} size="lg" />
            </div>
            <div className="mb-2">
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Name & basic */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student?.name}</h2>
              <a href={`mailto:${student?.email}`} className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:underline mt-1">
                <Mail size={14} /> {student?.email}
              </a>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                {p.branch && (
                  <span className="flex items-center gap-1.5 font-bold">
                    <GraduationCap size={14} /> {p.branch}
                  </span>
                )}
                {p.cgpa !== undefined && p.cgpa !== null && (
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500" /> CGPA: <strong className="text-slate-800 dark:text-white">{p.cgpa}</strong>
                  </span>
                )}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase
                  ${candidate.matchScore >= 75 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Zap size={11} fill="currentColor" /> {candidate.matchScore}% Match
                </div>
              </div>
            </div>

            {/* About */}
            {p.about && (
              <Section icon={<User size={16} />} title="About">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.about}</p>
              </Section>
            )}

            {/* Skills */}
            {p.skills?.length > 0 && (
              <Section icon={<Code2 size={16} />} title="Skills">
                <div className="flex flex-wrap gap-2">
                  {p.skills.map(s => <SkillBadge key={s} skill={s} />)}
                </div>
              </Section>
            )}

            {/* Resume */}
            <Section icon={<FileText size={16} />} title="Resume">
              {p.resumeLink ? (
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20"
                  >
                    <Download size={16} /> Download {student?.name}'s Resume
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No resume uploaded.</p>
              )}
            </Section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Section = ({ icon, title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-violet-500">{icon}</span>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{title}</h3>
    </div>
    {children}
  </div>
);

/* ─── Applicant Card ───────────────────────────────────── */
const ApplicantCard = ({ candidate, index, onViewProfile, onStatusChange, onPPOOffer }) => {
  const { student, studentProfile, status, matchScore, isEligible, ppoOffered } = candidate;
  const p = studentProfile || {};

  const allStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300
        hover:shadow-xl hover:-translate-y-1 ${!isEligible ? 'border-rose-100 dark:border-rose-900/30' : 'border-slate-200/60 dark:border-slate-800/60'}`}
    >
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-5">
        <Avatar src={p.profilePhoto} name={student?.name} />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {student?.name || 'Unknown'}
            </h3>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${matchScore >= 75 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <Zap size={10} fill="currentColor" /> {matchScore}% Match
            </div>
            {ppoOffered && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase tracking-tighter">
                <Star size={10} fill="currentColor" /> PPO Offered
              </span>
            )}
            {!isEligible && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded uppercase tracking-tighter">
                <AlertCircle size={10} /> Ineligible
              </span>
            )}
            {p.isPlaced && (
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded">
                Placed (Tier {p.placedTier})
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            {p.branch && <span className="flex items-center gap-1"><GraduationCap size={12} /> {p.branch}</span>}
            {p.cgpa && <span className="flex items-center gap-1 text-amber-600"><Star size={12} fill="currentColor" /> {p.cgpa} CGPA</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onPPOOffer(candidate._id, !ppoOffered)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
              ${ppoOffered ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200'}`}
          >
            {ppoOffered ? 'Revoke PPO' : 'Offer PPO'}
          </button>

          <select
            value={status}
            onChange={e => onStatusChange(candidate._id, e.target.value)}
            className="text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2
              bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
          >
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button
            onClick={() => onViewProfile(candidate)}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Page ────────────────────────────────────────── */
const ViewApplicants = () => {
  const { id: jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterEligible, setFilterEligible] = useState(false);
  const [sortBy, setSortBy] = useState('matchScore'); // 'matchScore' or 'cgpa'
  const [sortOrder, setSortOrder] = useState('desc');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          axios.get(`http://localhost:5005/api/applications/job/${jobId}`),
          axios.get(`http://localhost:5005/api/jobs/${jobId}`)
        ]);
        setCandidates(appRes.data);
        setJob(jobRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'recruiter') fetchApplications();
  }, [user, jobId]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(`http://localhost:5005/api/applications/${applicationId}/status`, { status: newStatus });
      setCandidates(prev => prev.map(c => c._id === applicationId ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const togglePPO = async (applicationId, ppoState) => {
    try {
      await axios.put(`http://localhost:5005/api/applications/${applicationId}/status`, { ppoOffered: ppoState });
      setCandidates(prev => prev.map(c => c._id === applicationId ? { ...c, ppoOffered: ppoState, status: ppoState ? 'Selected' : c.status } : c));
    } catch (error) {
      console.error('Error toggling PPO', error);
    }
  };

  const processedCandidates = candidates
    .filter(c => !filterEligible || c.isEligible)
    .sort((a, b) => {
      let valA = sortBy === 'matchScore' ? a.matchScore : (a.studentProfile?.cgpa || 0);
      let valB = sortBy === 'matchScore' ? b.matchScore : (b.studentProfile?.cgpa || 0);
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link to="/recruiter-dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Recruiter Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest w-fit mb-3 border border-indigo-100 dark:border-indigo-800/50">
              <Briefcase size={12} /> Talent Acquisition
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-none">
              Applicants for <span className="text-indigo-600">{job?.title}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold text-sm">
              {candidates.length} Profiles Received · {candidates.filter(c => c.isEligible).length} Eligible
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilterEligible(!filterEligible)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${filterEligible ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'}`}
            >
              <Filter size={14} /> Only Eligible
            </button>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button onClick={() => setSortBy('matchScore')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'matchScore' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>Skills</button>
              <button onClick={() => setSortBy('cgpa')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'cgpa' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>CGPA</button>
            </div>
          </div>
        </div>

        {processedCandidates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No matching profiles</h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {processedCandidates.map((c, i) => (
              <ApplicantCard
                key={c._id}
                candidate={c}
                index={i}
                onViewProfile={setSelectedCandidate}
                onStatusChange={updateStatus}
                onPPOOffer={togglePPO}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCandidate && (
        <FullProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
};

export default ViewApplicants;
