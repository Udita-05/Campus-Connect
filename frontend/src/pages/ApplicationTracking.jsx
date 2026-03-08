import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Building, Clock, MapPin, ExternalLink, CheckCircle, XCircle, FileText, Users } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'Shortlisted': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'Interview': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'Selected': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
  };

  const style = styles[status] || styles['Applied'];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {status}
    </span>
  );
};

const ApplicationTracking = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get('http://localhost:5005/api/applications/my-applications');
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchApplications();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">Track the status of all your job applications in one place.</p>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-20">
          <Briefcase size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-6">You haven't applied to any jobs yet. Start exploring!</p>
          <a href="/jobs" className="btn-primary">Browse Jobs</a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={app._id}
              className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold dark:text-white">{app.job?.title || 'Unknown Job'}</h3>
                  <StatusBadge status={app.status} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5"><Building size={16} /> {app.job?.companyName}</div>
                  <div className="flex items-center gap-1.5"><MapPin size={16} /> {app.job?.location || 'Remote'}</div>
                  <div className="flex items-center gap-1.5"><Briefcase size={16} /> {app.job?.type}</div>
                </div>

                {/* Status History Timeline */}
                {app.statusHistory?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Application Timeline</p>
                    <div className="relative pl-4 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                      {app.statusHistory.map((history, i) => (
                        <div key={i} className="relative flex items-center gap-3">
                          <div className={`absolute -left-[14px] w-[10px] h-[10px] rounded-full border-2 border-white dark:border-slate-900 
                            ${i === app.statusHistory.length - 1 ? 'bg-violet-500 ring-4 ring-violet-500/20' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          <div>
                            <p className={`text-xs font-bold ${i === app.statusHistory.length - 1 ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500'}`}>
                              {history.status}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {new Date(history.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheduling Timeline */}
                {(app.oaDateTime || app.gdDateTime || app.interviewDateTime) && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-1">Upcoming Procedure</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {app.oaDateTime && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Online Assessment</p>
                            <p className="text-xs font-bold dark:text-white">{new Date(app.oaDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                      )}
                      {app.gdDateTime && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Users size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Group Discussion</p>
                            <p className="text-xs font-bold dark:text-white">{new Date(app.gdDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                      )}
                      {app.interviewDateTime && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <Clock size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Interview</p>
                            <p className="text-xs font-bold dark:text-white">{new Date(app.interviewDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {app.locationOrLink && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <MapPin size={14} className="text-rose-500" /> Venue / Link: {app.locationOrLink}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 text-right w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                  <Clock size={14} /> Applied {new Date(app.createdAt).toLocaleDateString()}
                </div>
                <Link to={`/job/${app.job?._id}`} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-2">
                  Verify Job <ExternalLink size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracking;
