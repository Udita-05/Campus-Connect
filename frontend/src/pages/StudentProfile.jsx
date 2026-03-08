import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Book, Code, Link as LinkIcon, Edit2, Save, X,
  Plus, Trash2, ExternalLink, Star, GraduationCap, Briefcase, CheckCircle, Clock, FileText, Linkedin
} from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────── */
const authHeader = () => {
  const userInfo = localStorage.getItem('userInfo');
  const token = userInfo ? JSON.parse(userInfo).token : '';
  return { Authorization: `Bearer ${token}` };
};

/* ─── Main Component ───────────────────────────────────── */
const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Flat form fields
  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    cgpa: '',
    resumeLink: '',
    about: '',
    profilePhoto: '',
    skillsRaw: '',
    linkedIn: '',
  });

  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // ── fetch ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('https://campus-connect-k0va.onrender.com/api/profile/student', {
          headers: authHeader(),
        });
        setProfile(data);
        populateForm(data);
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const populateForm = (data) => {
    setFormData({
      college: data.college || '',
      branch: data.branch || '',
      cgpa: data.cgpa ?? '',
      resumeLink: data.resumeLink || '',
      about: data.about || '',
      profilePhoto: data.profilePhoto || '',
      skillsRaw: Array.isArray(data.skills) ? data.skills.join(', ') : '',
      linkedIn: data.linkedIn || '',
    });
    setProjects(data.projects || []);
    setExperience(data.experience || []);
    setEducation(data.education || []);
    setAchievements(data.achievements || []);
  };

  // ── submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = formData.skillsRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const cleanProjects = projects
        .filter(p => p.title?.trim())
        .map(p => ({ title: p.title.trim(), description: p.description?.trim(), link: p.link?.trim() }));

      const payload = {
        college: formData.college,
        branch: formData.branch,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
        resumeLink: formData.resumeLink,
        about: formData.about,
        profilePhoto: formData.profilePhoto,
        linkedIn: formData.linkedIn,
        skills: skillsArray,
        projects: cleanProjects,
        experience,
        education,
        achievements
      };

      const { data } = await axios.put('https://campus-connect-k0va.onrender.com/api/profile/student', payload, {
        headers: authHeader(),
      });
      setProfile(data);
      populateForm(data);
      setIsEditing(false);
      setSaveSuccess(true);
      setSaveError('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile', error);
      setSaveError(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const cancelEdit = () => {
    if (profile) populateForm(profile);
    setIsEditing(false);
  };

  const addItem = (setter) => setter(prev => [...prev, {}]);
  const removeItem = (setter, i) => setter(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (setter, i, field, val) => setter(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  // ── loading state ──────────────────────────────────────
  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500" />
    </div>
  );

  const strength = profile?.profileStrength || 0;
  const strengthColor = strength >= 80 ? 'from-emerald-400 to-green-500' :
    strength >= 50 ? 'from-violet-500 to-indigo-500' :
      'from-rose-400 to-orange-400';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-xl"
          >
            <CheckCircle size={18} /> Profile saved successfully!
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 text-white font-semibold shadow-xl"
          >
            <X size={18} /> {saveError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
        style={{ boxShadow: '0 4px 24px rgba(139,92,246,0.07)' }}
      >
        <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex justify-between items-end mb-6">
            <div className="p-1 bg-white dark:bg-slate-900 rounded-full">
              {profile?.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white dark:ring-slate-900 shadow-xl">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={() => isEditing ? cancelEdit() : setIsEditing(true)}
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-2xl border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all bg-white dark:bg-slate-800 shadow-sm"
            >
              {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><User size={14} className="text-violet-500" /> Student</span>
                {profile?.branch && <span className="flex items-center gap-1.5">· <GraduationCap size={14} className="text-violet-500" /> {profile.branch}</span>}
                {profile?.cgpa && <span className="flex items-center gap-1.5">· <Star size={14} className="text-amber-500" /> {profile.cgpa} CGPA</span>}
                {profile?.linkedIn && (
                  <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0A66C2] hover:underline">
                    · <Linkedin size={14} /> LinkedIn
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Strength</span>
                  <span className="text-xs font-black text-violet-600">{strength}%</span>
                </div>
                <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${strength}%` }} transition={{ duration: 1 }} className={`h-full rounded-full bg-gradient-to-r ${strengthColor}`} />
                </div>
              </div>
              <Link to="/resume-builder" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-[11px] uppercase tracking-wider hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
                <FileText size={15} /> Build Resume
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Grid 1: Basic Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="College / University">
                  <input type="text" name="college" value={formData.college} onChange={handleChange} className="input-field" placeholder="University Name" />
                </Field>
                <Field label="Branch / Specialization">
                  <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="input-field" placeholder="e.g. Computer Science" />
                </Field>
                <Field label="Current CGPA">
                  <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="input-field" placeholder="0.00" />
                </Field>
                <Field label="Resume Link (Cloud URL)">
                  <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange} className="input-field" placeholder="https://..." />
                </Field>
                <Field label="LinkedIn Profile URL">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin size={16} className="text-[#0A66C2]" />
                    </span>
                    <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} className="input-field pl-10" placeholder="https://linkedin.com/in/your-profile" />
                  </div>
                </Field>
              </div>

              <Field label="About Me Summary">
                <textarea name="about" value={formData.about} onChange={handleChange} rows={3} className="input-field" placeholder="Write a professional summary..." />
              </Field>

              <Field label="Core Skills (comma separated)">
                <input type="text" name="skillsRaw" value={formData.skillsRaw} onChange={handleChange} className="input-field" placeholder="React, Python, Node..." />
              </Field>

              {/* Dyn Sections */}
              <EditSectionList title="Education History" items={education} setter={setEducation} fields={['school', 'degree', 'fieldOfStudy', 'startYear', 'endYear']} />
              <EditSectionList title="Work Experience" items={experience} setter={setExperience} fields={['title', 'company', 'description']} />
              <EditSectionList title="Projects" items={projects} setter={setProjects} fields={['title', 'description', 'link']} />
              <EditSectionList title="Achievements" items={achievements} setter={setAchievements} fields={['title', 'description']} />

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={cancelEdit} className="btn-secondary px-8 font-bold">Discard</button>
                <button type="submit" disabled={saving} className="btn-primary bg-violet-600 px-10 font-bold flex items-center gap-2">
                  {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }}><Save size={16} /></motion.div> : <Save size={16} />}
                  Save Profile
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {profile?.about && (
              <Section title="Summary" icon={<User size={15} />}>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{profile.about}</p>
              </Section>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Section title="Academic Context" icon={<GraduationCap size={15} />}>
                <InfoRow label="Institution" value={profile?.college} />
                <InfoRow label="Program" value={profile?.branch} />
                <InfoRow label="Grade" value={profile?.cgpa ? `${profile.cgpa} CGPA` : null} />
              </Section>

              <Section title="Skills & Tech" icon={<Code size={15} />}>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 text-[11px] font-bold rounded-lg border border-violet-100 dark:border-violet-800">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            </div>

            <Section title="Education" icon={<Book size={15} />}>
              {profile?.education?.length > 0 ? profile.education.map((edu, i) => (
                <div key={i} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <h4 className="font-bold text-slate-900 dark:text-white">{edu.school}</h4>
                  <p className="text-xs text-slate-500 font-medium">{edu.degree} in {edu.fieldOfStudy} · {edu.startYear}-{edu.endYear}</p>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No education history added.</p>}
            </Section>

            <Section title="Experience" icon={<Briefcase size={15} />}>
              {profile?.experience?.length > 0 ? profile.experience.map((exp, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <h4 className="font-bold text-slate-900 dark:text-white">{exp.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{exp.company}</p>
                  <p className="text-xs text-slate-500 mt-1">{exp.description}</p>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No work experience listed.</p>}
            </Section>

            <Section title="Projects" icon={<Code size={15} />}>
              {profile?.projects?.length > 0 ? profile.projects.map((proj, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{proj.description}</p>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No projects added.</p>}
            </Section>

            <Section title="Recognition" icon={<Star size={15} />}>
              {profile?.achievements?.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">{ach.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{ach.description}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-400 italic">No achievements added.</p>}
            </Section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Components ────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    {children}
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{title}</h3>
    </div>
    {children}
  </div>
);

const EditSectionList = ({ title, items, setter, fields }) => {
  const addItem = () => setter(prev => [...prev, {}]);
  const removeItem = (i) => setter(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setter(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const formatPlaceholder = (str) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  };

  return (
    <div className="space-y-4 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black uppercase tracking-tight text-slate-400">{title}</h4>
        <button type="button" onClick={addItem} className="text-[11px] font-bold text-violet-600 flex items-center gap-1 hover:underline px-2 py-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 relative group">
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Trash2 size={12} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f} className={f === 'description' || f === 'about' ? 'sm:col-span-2' : ''}>
                  {f === 'description' ? (
                    <textarea
                      value={item[f] || ''}
                      onChange={e => updateItem(i, f, e.target.value)}
                      placeholder={formatPlaceholder(f)}
                      className="input-field min-h-[80px] py-2"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[f] || ''}
                      onChange={e => updateItem(i, f, e.target.value)}
                      placeholder={formatPlaceholder(f)}
                      className="input-field"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-800 last:border-0">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <span className="text-xs font-bold text-slate-800 dark:text-white">{value || <span className="text-slate-300 font-normal italic">Empty</span>}</span>
  </div>
);

export default StudentProfile;
