import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Briefcase, FileText, CheckCircle, XCircle,
  Calendar, Clock, MapPin, Search, ChevronRight, User, ExternalLink, Filter
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, applications, users
  const [stats, setStats] = useState({ students: 0, recruiters: 0, jobs: 0, applications: 0 });
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Scheduling state
  const [selectedApp, setSelectedApp] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    oaDateTime: '',
    gdDateTime: '',
    interviewDateTime: '',
    locationOrLink: '',
    status: ''
  });

  const getAuthHeader = () => {
    const userInfo = localStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : '';
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const auth = getAuthHeader();
      const [statsRes, jobsRes, usersRes, appsRes] = await Promise.all([
        axios.get('https://campus-connect-k0va.onrender.com/api/admin/stats', auth),
        axios.get('https://campus-connect-k0va.onrender.com/api/admin/jobs', auth),
        axios.get('https://campus-connect-k0va.onrender.com/api/admin/users', auth),
        axios.get('https://campus-connect-k0va.onrender.com/api/applications/admin/all', auth)
      ]);

      setStats(statsRes.data);
      setPendingJobs(jobsRes.data.filter(job => job.status === 'pending'));
      setUsers(usersRes.data);
      setAllApplications(appsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId, status) => {
    try {
      await axios.put(`https://campus-connect-k0va.onrender.com/api/admin/jobs/${jobId}/status`, { status }, getAuthHeader());
      setPendingJobs(prev => prev.filter(job => job._id !== jobId));
      fetchData();
    } catch (error) {
      alert('Failed to update job status');
    }
  };

  const openScheduleModal = (app) => {
    setSelectedApp(app);
    setScheduleData({
      oaDateTime: app.oaDateTime ? new Date(app.oaDateTime).toISOString().slice(0, 16) : '',
      gdDateTime: app.gdDateTime ? new Date(app.gdDateTime).toISOString().slice(0, 16) : '',
      interviewDateTime: app.interviewDateTime ? new Date(app.interviewDateTime).toISOString().slice(0, 16) : '',
      locationOrLink: app.locationOrLink || '',
      status: app.status || 'Applied'
    });
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://campus-connect-k0va.onrender.com/api/applications/admin/${selectedApp._id}/procedure`, scheduleData, getAuthHeader());
      setSelectedApp(null);
      fetchData();
    } catch (error) {
      alert('Failed to update schedule');
    }
  };

  const filteredApps = allApplications.filter(app =>
    app.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    app.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
    app.job?.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold mb-3 border border-violet-200 dark:border-violet-800">
              <Shield size={14} /> T&P Cell Administrator
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Placement Command Center</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage global recruitment flows and schedule assessments.</p>
          </div>

          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {['overview', 'applications', 'users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
                { label: 'Placed Students', value: stats.placedStudents || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
                { label: 'Active Jobs', value: stats.jobs, icon: FileText, color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/40' },
                { label: 'PPO Offers', value: stats.ppoOffers || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/40' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Job Approvals */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={20} className="text-violet-500" /> Pending Job Verifications
                </h2>
                {pendingJobs.length === 0 ? (
                  <div className="card text-center py-10 border-dashed border-2">
                    <CheckCircle className="mx-auto w-10 h-10 text-emerald-500 mb-3 opacity-50" />
                    <p className="text-slate-500 font-medium tracking-tight">All company postings are currently verified.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingJobs.map(job => (
                      <div key={job._id} className="card group hover:border-violet-300 dark:hover:border-violet-700">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                            <p className="text-violet-600 dark:text-violet-400 font-bold text-sm mb-2">{job.companyName}</p>
                            <div className="flex gap-4 text-xs font-bold text-slate-500">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                              <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleJobAction(job._id, 'approved')} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"><CheckCircle size={20} /></button>
                            <button onClick={() => handleJobAction(job._id, 'rejected')} className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"><XCircle size={20} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Directory */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <User size={20} className="text-violet-500" /> Recent Onboarding
                </h2>
                <div className="card p-0 overflow-hidden">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {users.slice(0, 5).map(u => (
                      <div key={u._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${u.role === 'recruiter' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{u.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${u.role === 'recruiter' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Active Placement Pipelines</h2>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text" placeholder="Search by student, company, or job role..."
                  className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="card p-0 overflow-hidden border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student / Profile</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Phase Schedule</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredApps.map(app => (
                      <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{app.student?.name}</div>
                          <div className="text-xs text-slate-500">{app.studentProfile?.branch || 'N/A'} · {app.studentProfile?.cgpa || 'No'} CGPA</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700 dark:text-slate-200">{app.job?.title}</div>
                          <div className="text-xs font-bold text-violet-600 dark:text-violet-400">{app.job?.companyName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${app.status === 'Selected' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            app.status === 'Rejected' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                              'bg-violet-100 text-violet-700 border-violet-200'
                            }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {app.oaDateTime && <div className="text-[10px] font-bold text-blue-500 flex items-center gap-1"><Clock size={10} /> OA: {new Date(app.oaDateTime).toLocaleString()}</div>}
                            {app.gdDateTime && <div className="text-[10px] font-bold text-purple-500 flex items-center gap-1"><Clock size={10} /> GD: {new Date(app.gdDateTime).toLocaleString()}</div>}
                            {app.interviewDateTime && <div className="text-[10px] font-bold text-orange-500 flex items-center gap-1"><Clock size={10} /> PI: {new Date(app.interviewDateTime).toLocaleString()}</div>}
                            {!app.oaDateTime && !app.gdDateTime && !app.interviewDateTime && <span className="text-[10px] text-slate-400 italic">Not scheduled</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-right">
                          <button
                            onClick={() => openScheduleModal(app)}
                            className="p-2 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                          >
                            <Calendar size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Schedule Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Workflow Management</h3>
                <p className="text-sm text-slate-500 font-medium">{selectedApp.student?.name} · {selectedApp.job?.title}</p>
              </div>

              <form onSubmit={handleUpdateSchedule} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Application Status</label>
                  <select
                    value={scheduleData.status}
                    onChange={e => setScheduleData({ ...scheduleData, status: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    {['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><Calendar size={10} /> Online Assessment</label>
                    <input type="datetime-local" value={scheduleData.oaDateTime} onChange={e => setScheduleData({ ...scheduleData, oaDateTime: e.target.value })} className="input-field py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><Users size={10} /> Group Discussion</label>
                    <input type="datetime-local" value={scheduleData.gdDateTime} onChange={e => setScheduleData({ ...scheduleData, gdDateTime: e.target.value })} className="input-field py-2 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><Clock size={10} /> Personal Interview</label>
                  <input type="datetime-local" value={scheduleData.interviewDateTime} onChange={e => setScheduleData({ ...scheduleData, interviewDateTime: e.target.value })} className="input-field py-2 text-sm" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><MapPin size={10} /> Venue / Meeting Link</label>
                  <input type="text" value={scheduleData.locationOrLink} onChange={e => setScheduleData({ ...scheduleData, locationOrLink: e.target.value })} placeholder="Room 201 / Zoom Link" className="input-field py-2 text-sm" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setSelectedApp(null)} className="btn-secondary w-full py-2 text-sm">Cancel</button>
                  <button type="submit" className="btn-primary w-full py-2 text-sm bg-violet-600">Update Procedure</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
