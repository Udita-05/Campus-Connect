import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Zap, TrendingUp, MapPin, Star,
  ArrowRight, CheckCircle, Clock, Award, Target, Building2, ChevronRight
} from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const TOP_COMPANIES = [
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com', color: '#4285F4', jobs: 12 },
  { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', color: '#00A4EF', jobs: 8 },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', color: '#FF9900', jobs: 15 },
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', color: '#0081FB', jobs: 6 },
  { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', color: '#FF0000', jobs: 9 },
  { name: 'Flipkart', logo: 'https://logo.clearbit.com/flipkart.com', color: '#2874F0', jobs: 11 },
  { name: 'Goldman Sachs', logo: 'https://logo.clearbit.com/goldmansachs.com', color: '#6DB33F', jobs: 7 },
  { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com', color: '#007CC3', jobs: 20 },
  { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com', color: '#9c27b0', jobs: 18 },
  { name: 'Tata Consultancy Services', logo: 'https://logo.clearbit.com/tcs.com', color: '#003587', jobs: 25 },
  { name: 'Deloitte', logo: 'https://logo.clearbit.com/deloitte.com', color: '#86BC25', jobs: 14 },
  { name: 'Razorpay', logo: 'https://logo.clearbit.com/razorpay.com', color: '#2D76FF', jobs: 5 },
];

const FEATURED_JOBS = [
  {
    id: 1, title: 'Software Engineer Intern', company: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com',
    location: 'Hyderabad', type: 'Internship', stipend: '₹80,000/mo', skills: ['React', 'Node.js', 'Azure'],
    tier: 1, posted: '2 days ago', applicants: 143,
  },
  {
    id: 2, title: 'Data Analyst', company: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com',
    location: 'Bengaluru', type: 'Full-time', stipend: '₹18 LPA', skills: ['Python', 'SQL', 'Tableau'],
    tier: 1, posted: '1 day ago', applicants: 256,
  },
  {
    id: 3, title: 'Frontend Developer', company: 'Razorpay', logo: 'https://logo.clearbit.com/razorpay.com',
    location: 'Remote', type: 'Internship', stipend: '₹50,000/mo', skills: ['React', 'TypeScript', 'CSS'],
    tier: 2, posted: '3 days ago', applicants: 89,
  },
  {
    id: 4, title: 'Machine Learning Engineer', company: 'Google', logo: 'https://logo.clearbit.com/google.com',
    location: 'Bengaluru', type: 'Full-time', stipend: '₹30 LPA', skills: ['Python', 'TensorFlow', 'GCP'],
    tier: 1, posted: 'Today', applicants: 412,
  },
  {
    id: 5, title: 'Software Developer', company: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com',
    location: 'Pune', type: 'Full-time', stipend: '₹6.5 LPA', skills: ['Java', 'Spring Boot', 'MySQL'],
    tier: 3, posted: 'Today', applicants: 620,
  },
  {
    id: 6, title: 'Business Analyst Intern', company: 'Deloitte', logo: 'https://logo.clearbit.com/deloitte.com',
    location: 'Mumbai', type: 'Internship', stipend: '₹45,000/mo', skills: ['Excel', 'SQL', 'PowerBI'],
    tier: 2, posted: '5 days ago', applicants: 178,
  },
];

const PLACEMENT_RECORDS = [
  { year: '2024', placed: '94%', avgPackage: '₹12.4 LPA', highestPackage: '₹48 LPA', companies: 85, icon: '🏆' },
  { year: '2023', placed: '91%', avgPackage: '₹10.8 LPA', highestPackage: '₹42 LPA', companies: 78, icon: '🥇' },
  { year: '2022', placed: '88%', avgPackage: '₹9.2 LPA', highestPackage: '₹38 LPA', companies: 65, icon: '🎯' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'SDE @ Google', batch: 'CSE 2024',
    text: 'CampusConnect made my placement journey seamless. Got shortlisted for Google within a week of applying!',
    avatar: 'PS', color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Rahul Verma', role: 'Analyst @ Goldman Sachs', batch: 'ECE 2023',
    text: 'The skill matching feature was incredible! It connected me with jobs that perfectly matched my profile.',
    avatar: 'RV', color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Ananya Patel', role: 'Product Manager @ Flipkart', batch: 'MBA 2024',
    text: 'Best campus placement platform. The application tracking kept me updated at every step.',
    avatar: 'AP', color: 'from-purple-500 to-pink-600',
  },
];

const TIER_COLORS = {
  1: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50',
  2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
  3: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
};

const TIER_LABELS = { 1: '⭐ Tier 1 Dream', 2: '🔷 Tier 2 Core', 3: '🔹 Tier 3 Mass' };

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const JobCard = ({ job }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4, boxShadow: '0 20px 60px -10px rgba(99,102,241,0.15)' }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer group"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <img src={job.logo} alt={job.company} className="w-8 h-8 object-contain" onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-lg font-bold text-slate-500">${job.company[0]}</span>`; }} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{job.company}</p>
        </div>
      </div>
      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${TIER_COLORS[job.tier]}`}>{TIER_LABELS[job.tier]}</span>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {job.skills.map(s => (
        <span key={s} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 px-2 py-0.5 rounded-full font-medium">{s}</span>
      ))}
    </div>

    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
        <span className="flex items-center gap-1"><Clock size={11} /> {job.posted}</span>
      </div>
      <span className="font-semibold text-green-600 dark:text-green-400">{job.stipend}</span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-400">{job.applicants} applicants</span>
      <Link to="/login" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
        Apply Now <ArrowRight size={12} />
      </Link>
    </div>
  </motion.div>
);

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

const Home = () => {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center isolate">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 text-sm font-medium mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            🎓 Campus Placements 2026 are Live!
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]">
            Your Dream Career
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
              Starts Here
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            India's smartest campus placement portal. Connecting <strong className="text-slate-800 dark:text-slate-200">10,000+ students</strong> with top recruiters from <strong className="text-slate-800 dark:text-slate-200">500+ companies</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-12">
            <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-emerald-500" /> AI-Powered Skill Matching</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-emerald-500" /> Real-Time Application Tracking</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-emerald-500" /> Tier-Based Placement Policy</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-4 flex items-center gap-2 group rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
              Apply for Placements
              <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/signup" className="text-base px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
              <Building2 size={18} className="text-indigo-500" /> Post a Job
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE COMPANY LOGOS ────────────────────────────────── */}
      <section className="py-10 border-y border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
        <div className="text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Trusted by India's Top Recruiters</p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...TOP_COMPANIES, ...TOP_COMPANIES].map((company, i) => (
              <div key={i} className="flex items-center gap-3 mx-10 shrink-0">
                <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain opacity-60 hover:opacity-100 transition-opacity" onError={e => { e.target.style.display = 'none'; }} />
                <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 70% 50%, #a855f7 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '10,000+', label: 'Students Placed', icon: '🎓' },
              { value: '500+', label: 'Partner Companies', icon: '🏢' },
              { value: '₹48 LPA', label: 'Highest Package', icon: '💰' },
              { value: '94%', label: 'Placement Rate', icon: '🚀' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-5xl md:text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOB OPENINGS ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">🔥 Live Openings</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Featured Job Openings</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Handpicked roles from top-tier companies, updated daily.</p>
          </div>
          <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all">
            View All Jobs <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_JOBS.map((job) => <JobCard key={job.id} job={job} />)}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">View All Jobs <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* ── TOP COMPANIES ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 mb-10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">🏢 Our Partners</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Top Recruiting Companies</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">These companies consistently hire our campus talent.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {TOP_COMPANIES.map((company) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xl font-black text-slate-500">${company.name[0]}</span>`; }} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{company.name}</p>
                <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">{company.jobs} openings</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PLACEMENT RECORDS ─────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">📊 Track Record</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Placement History</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Consistent excellence in campus placements, year over year.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLACEMENT_RECORDS.map((record, i) => (
            <motion.div
              key={record.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-4 right-4 text-4xl opacity-20">{record.icon}</div>
              <div className="text-5xl font-black text-slate-200 dark:text-slate-700 mb-4">{record.year}</div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Placement Rate</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{record.placed}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Avg Package</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{record.avgPackage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Award size={20} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Highest Package</p>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{record.highestPackage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Companies Visited</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{record.companies}+</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOR WHOM ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">

          {/* For Students */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="relative">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">🎓</div>
              <h3 className="text-2xl font-bold mb-3">For Students</h3>
              <p className="text-indigo-200 mb-6 leading-relaxed">Build your profile, match with top companies, and track your applications in real-time. Your career journey starts here.</p>
              <ul className="space-y-2 mb-8">
                {['AI-powered skill matching', 'Real-time application status', 'Built-in resume builder', 'Tier-based placement policy'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-indigo-100"><CheckCircle size={14} className="text-indigo-300 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                Register as Student <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* For Recruiters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/40 border border-slate-700"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="relative">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">🏢</div>
              <h3 className="text-2xl font-bold mb-3">For Recruiters</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">Post jobs, filter candidates by skills, CGPA and branch, and hire the best campus talent — faster than ever.</p>
              <ul className="space-y-2 mb-8">
                {['CGPA & branch filtering', 'View applicant profiles & resumes', 'PPO & offer management', 'Admin-approved placement drives'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle size={14} className="text-emerald-400 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Post a Job <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 mb-10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">💬 Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">What Our Alumni Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>{t.avatar}</div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-indigo-500 font-medium">{t.role}</p>
                  <p className="text-xs text-slate-400">{t.batch}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Ready to Land Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Dream Job?</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands of students who found their careers through CampusConnect. Sign up free today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-10 py-4 rounded-xl shadow-lg shadow-indigo-500/20">
              Get Started — It's Free
            </Link>
            <Link to="/jobs" className="text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              Browse Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
