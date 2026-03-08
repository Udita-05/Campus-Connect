import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, Users, PlusCircle, ExternalLink, CalendarDays, Trash2, Edit } from 'lucide-react';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5005/api/jobs/recruiter');
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'recruiter') fetchMyJobs();
  }, [user]);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`http://localhost:5005/api/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
        alert('Job deleted successfully');
      } catch (error) {
        console.error('Error deleting job', error);
        alert(error.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your job postings and applicants</p>
        </div>

        <Link to="/post-job" className="btn-primary flex items-center gap-2">
          <PlusCircle size={20} />
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/20 border-primary-200 dark:border-primary-800/50">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-200 dark:bg-primary-900/60 rounded-xl text-primary-700 dark:text-primary-300">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-800 dark:text-primary-400 mb-1">Active Jobs</p>
              <h3 className="text-3xl font-bold text-primary-900 dark:text-white">{jobs.length}</h3>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-200 dark:bg-blue-900/60 rounded-xl text-blue-700 dark:text-blue-300">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">Total Applicants</p>
              {/* Dummy count for demo purposes */}
              <h3 className="text-3xl font-bold text-blue-900 dark:text-white">{jobs.length * 4}</h3>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Job Postings</h2>

      {jobs.length === 0 ? (
        <div className="card py-16 text-center border-dashed border-2">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Briefcase size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't posted any job openings. Create your first listing to start receiving applications from talented students.</p>
          <Link to="/post-job" className="btn-primary">Create Job Listing</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={job._id}
              className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                  <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-200 dark:border-green-800/50">
                    Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1.5"><Briefcase size={16} /> {job.type}</div>
                  <div className="flex items-center gap-1.5"><CalendarDays size={16} /> Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-1 max-w-2xl">{job.description}</p>
              </div>

              <div className="flex sm:flex-col lg:flex-row items-center sm:items-end lg:items-center justify-between lg:justify-end w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 gap-3">
                <Link to={`/job/${job._id}/applicants`} className="btn-secondary whitespace-nowrap flex items-center justify-center gap-2">
                  <Users size={16} /> Applicants
                </Link>
                <Link to={`/edit-job/${job._id}`} className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors border border-indigo-100 dark:border-indigo-800/50" title="Edit Job">
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="p-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 transition-colors border border-red-100 dark:border-red-800/50"
                  title="Delete Job"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
