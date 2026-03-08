import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, FileText, ArrowLeft, Layout, Settings,
    Printer, CheckCircle, Mail, Phone, MapPin, Globe,
    Linkedin, Github, ExternalLink, Award, Briefcase, GraduationCap
} from 'lucide-react';

const authHeader = () => {
    const userInfo = localStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';
    return { Authorization: `Bearer ${token}` };
};

const ResumeBuilder = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const resumeRef = useRef();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState('modern'); // 'modern', 'classic', 'minimal'
    const [accentColor, setAccentColor] = useState('#6366f1'); // Indigo-500

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('http://localhost:5005/api/profile/student', {
                    headers: authHeader(),
                });
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchProfile();
    }, [user]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 print:bg-white print:pb-0">
            {/* Top Banner - Hidden on print */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-30 print:hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/profile')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Resume Intelligence</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Builder · {profile?.user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 mr-4 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Template:</span>
                            <select
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                            >
                                <option value="modern">Modern Alpha</option>
                                <option value="classic">Royal Classic</option>
                                <option value="minimal">Tech Minimal</option>
                            </select>
                        </div>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
                            <Printer size={16} /> Print / Save PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr,400px] gap-10 print:block print:p-0 print:max-w-none">

                {/* Resume Canvas */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                    <div className={`resume-paper ${template}`} style={{ '--accent-color': accentColor }}>
                        {/* Template: Modern Alpha */}
                        {template === 'modern' && <ModernTemplate profile={profile} accentColor={accentColor} />}
                        {template === 'classic' && <ClassicTemplate profile={profile} accentColor={accentColor} />}
                        {template === 'minimal' && <MinimalTemplate profile={profile} accentColor={accentColor} />}
                    </div>
                </div>

                {/* Customization Sidebar - Hidden on print */}
                <div className="space-y-6 print:hidden">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                            <Settings size={14} /> Appearance
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Accent Theme</label>
                                <div className="flex flex-wrap gap-2">
                                    {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#0ea5e9', '#000000'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setAccentColor(c)}
                                            className={`w-8 h-8 rounded-full border-4 transition-all ${accentColor === c ? 'border-indigo-200 ring-2 ring-indigo-500 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Layout Engine</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <LayoutOption active={template === 'modern'} onClick={() => setTemplate('modern')} icon={<Layout size={14} />} title="Modern Alpha" desc="Bold sidebar & clean grid" />
                                    <LayoutOption active={template === 'classic'} onClick={() => setTemplate('classic')} icon={<Printer size={14} />} title="Royal Classic" desc="Centered & professional" />
                                    <LayoutOption active={template === 'minimal'} onClick={() => setTemplate('minimal')} icon={<FileText size={14} />} title="Tech Minimal" desc="Focus on whitespace" />
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 leading-relaxed">
                                    Tip: Your resume is automatically generated from your live profile data. Keep your profile updated for the best results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global CSS for Print and Resume Styles */}
            <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          @page { margin: 0; size: auto; }
        }
        
        .resume-paper {
          font-family: 'Inter', sans-serif;
          min-height: 297mm;
          padding: 0;
          color: #1a202c;
          background: white;
        }

        .dark .resume-paper {
           color: #1a202c; /* Always keep resume paper dark text */
           background: white;
        }
      `}</style>
        </div>
    );
};

/* ─── Layout Options ────────────────────────── */
const LayoutOption = ({ active, onClick, icon, title, desc }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-2xl border transition-all ${active ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700/50 ring-1 ring-indigo-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
    >
        <div className="flex items-center gap-3 mb-1">
            <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium ml-7">{desc}</p>
    </button>
);

/* ─── Modern Alpha Template ─────────────────── */
const ModernTemplate = ({ profile, accentColor }) => {
    return (
        <div className="grid grid-cols-[300px,1fr] min-h-[297mm]">
            {/* Sidebar */}
            <div className="bg-slate-900 text-white p-10 flex flex-col gap-10">
                <div className="text-center">
                    {profile.profilePhoto ? (
                        <img src={profile.profilePhoto} className="w-32 h-32 rounded-3xl mx-auto object-cover mb-6 border-2 border-white/20" />
                    ) : (
                        <div className="w-32 h-32 rounded-3xl mx-auto bg-white/10 flex items-center justify-center text-4xl font-black mb-6 border-2 border-white/20">
                            {profile.user?.name?.charAt(0)}
                        </div>
                    )}
                    <h2 className="text-2xl font-black tracking-tight mb-2 leading-none">{profile.user?.name}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile.branch || 'Student'}</p>
                </div>

                <div className="space-y-8">
                    <ResumeSection title="Contact" color="#fff">
                        <div className="space-y-4">
                            <ContactItem icon={<Mail size={12} />} text={profile.user?.email} />
                            <ContactItem icon={<Phone size={12} />} text="+91 9876543210" />
                            <ContactItem icon={<MapPin size={12} />} text={profile.college || 'Pune, India'} />
                            {profile.resumeLink && <ContactItem icon={<Globe size={12} />} text="Portfolio Link" />}
                        </div>
                    </ResumeSection>

                    <ResumeSection title="Core Skills" color="#fff">
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.map(s => (
                                <span key={s} className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold border border-white/10">{s}</span>
                            ))}
                        </div>
                    </ResumeSection>

                    <ResumeSection title="Education" color="#fff">
                        {profile.education?.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <p className="text-[11px] font-black text-white leading-tight mb-1">{edu.school}</p>
                                <p className="text-[10px] font-bold text-slate-400">{edu.degree}</p>
                                <p className="text-[9px] font-bold text-slate-500">{edu.startYear}-{edu.endYear}</p>
                            </div>
                        ))}
                    </ResumeSection>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-16 space-y-12">
                <div className="border-b-4 border-slate-900 pb-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Professional Summary</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {profile.about || 'Versatile and motivated student with a strong foundation in chosen field, seeking to leverage skills in a professional environment.'}
                    </p>
                </div>

                <div className="space-y-10">
                    <ResumeSection title="Work Experience" color="#0f172a">
                        {profile.experience?.length > 0 ? profile.experience.map((exp, i) => (
                            <div key={i} className="relative pl-8 border-l-2 border-slate-100">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-white" />
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-md font-black text-slate-900">{exp.title}</h4>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Mar 2023 - Present</span>
                                </div>
                                <p className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wider">{exp.company}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
                            </div>
                        )) : <p className="text-xs italic text-slate-400">Available upon request</p>}
                    </ResumeSection>

                    <ResumeSection title="Honors & Awards" color="#0f172a">
                        <div className="grid grid-cols-2 gap-6">
                            {profile.achievements?.map((ach, i) => (
                                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award size={14} className="text-indigo-600" />
                                        <h4 className="text-xs font-black text-slate-900">{ach.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-tight">{ach.description}</p>
                                </div>
                            ))}
                        </div>
                    </ResumeSection>

                    <ResumeSection title="Technical Projects" color="#0f172a">
                        <div className="space-y-6">
                            {profile.projects?.map((proj, i) => (
                                <div key={i}>
                                    <h4 className="text-xs font-black text-slate-900 mb-1 flex items-center justify-between">
                                        {proj.title}
                                        {proj.link && <span className="text-[9px] font-bold text-slate-400">{proj.link}</span>}
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </ResumeSection>
                </div>
            </div>
        </div>
    );
};

/* ─── Classic Template ─────────────────────────── */
const ClassicTemplate = ({ profile, accentColor }) => (
    <div className="p-20 space-y-12 min-h-[297mm]">
        <div className="text-center space-y-4 border-b pb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase" style={{ color: accentColor }}>{profile.user?.name}</h1>
            <div className="flex justify-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <span>{profile.user?.email}</span>
                <span>·</span>
                <span>+91 9876543210</span>
                <span>·</span>
                <span>{profile.college}</span>
            </div>
        </div>

        <div className="grid grid-cols-[1fr,250px] gap-16">
            <div className="space-y-12">
                <ClassicSection title="Professional Summary" accentColor={accentColor}>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.about}</p>
                </ClassicSection>

                <ClassicSection title="Work History" accentColor={accentColor}>
                    {profile.experience?.map((exp, i) => (
                        <div key={i} className="mb-6">
                            <div className="flex justify-between font-black text-sm text-slate-900 mb-1">
                                <span>{exp.title}</span>
                                <span className="text-[10px] text-slate-400">2023 - 2024</span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{exp.company}</p>
                            <p className="text-xs text-slate-500">{exp.description}</p>
                        </div>
                    ))}
                </ClassicSection>

                <ClassicSection title="Major Projects" accentColor={accentColor}>
                    {profile.projects?.map((proj, i) => (
                        <div key={i} className="mb-4">
                            <h4 className="font-black text-sm text-slate-900 mb-1">{proj.title}</h4>
                            <p className="text-xs text-slate-500">{proj.description}</p>
                        </div>
                    ))}
                </ClassicSection>
            </div>

            <div className="space-y-12">
                <ClassicSection title="Education" accentColor={accentColor}>
                    {profile.education?.map((edu, i) => (
                        <div key={i} className="mb-4">
                            <p className="font-black text-xs text-slate-900">{edu.school}</p>
                            <p className="text-[11px] text-slate-500">{edu.degree}</p>
                            <p className="text-[10px] font-bold" style={{ color: accentColor }}>{edu.startYear} - {edu.endYear}</p>
                        </div>
                    ))}
                </ClassicSection>

                <ClassicSection title="Expertise" accentColor={accentColor}>
                    <div className="flex flex-col gap-2">
                        {profile.skills?.map(s => (
                            <span key={s} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                {s}
                            </span>
                        ))}
                    </div>
                </ClassicSection>
            </div>
        </div>
    </div>
);

/* ─── Minimal Template ─────────────────────────── */
const MinimalTemplate = ({ profile, accentColor }) => (
    <div className="p-24 space-y-16 min-h-[297mm]">
        <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter" style={{ color: accentColor }}>{profile.user?.name}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">{profile.branch}</p>
        </div>

        <div className="space-y-12">
            <SectionGrid title="Experience">
                <div className="space-y-10">
                    {profile.experience?.map((exp, i) => (
                        <div key={i}>
                            <h4 className="font-black text-lg text-slate-900 mb-1">{exp.title}</h4>
                            <div className="flex items-center gap-2 text-xs font-bold mb-4 uppercase tracking-widest">
                                <span style={{ color: accentColor }}>{exp.company}</span>
                                <span className="text-slate-200">/</span>
                                <span className="text-slate-400">Present</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </SectionGrid>

            <SectionGrid title="Education">
                <div className="grid grid-cols-2 gap-8">
                    {profile.education?.map((edu, i) => (
                        <div key={i}>
                            <h4 className="font-black text-sm text-slate-900 mb-1">{edu.school}</h4>
                            <p className="text-xs text-slate-500 mb-2">{edu.degree}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 font-bold" style={{ color: accentColor }}>{edu.startYear}-{edu.endYear}</span>
                        </div>
                    ))}
                </div>
            </SectionGrid>

            <SectionGrid title="Stack">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {profile.skills?.map(s => (
                        <span key={s} className="text-sm font-black text-slate-800 tracking-tight">{s}</span>
                    ))}
                </div>
            </SectionGrid>
        </div>

        <div className="pt-16 border-t flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
            <span>{profile.user?.email}</span>
            <span>Generated via CampusConnect Intelligence</span>
        </div>
    </div>
);

/* ─── Resume Components ─────────────────────── */
const ResumeSection = ({ title, children, color }) => (
    <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color }}>{title}</h3>
        {children}
    </div>
);

const ClassicSection = ({ title, children, accentColor }) => (
    <div>
        <h3 className="text-xs font-black uppercase tracking-widest mb-4 border-b-2 pb-2" style={{ borderColor: accentColor }}>{title}</h3>
        {children}
    </div>
);

const SectionGrid = ({ title, children }) => (
    <div className="grid grid-cols-[140px,1fr] gap-10">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 pt-1">{title}</h3>
        <div>{children}</div>
    </div>
);

const ContactItem = ({ icon, text }) => (
    <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400 leading-none">
        <span className="text-white">{icon}</span>
        <span className="break-all">{text}</span>
    </div>
);

export default ResumeBuilder;
