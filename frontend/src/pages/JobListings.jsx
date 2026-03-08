import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { Search, Filter } from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobsAndProfile = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        const token = userInfo ? JSON.parse(userInfo).token : '';
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const jobsRes = await axios.get('http://localhost:5005/api/jobs', config);
        setJobs(jobsRes.data);

        if (user?.role === 'student' && token) {
          const appsRes = await axios.get('http://localhost:5005/api/applications/my-applications', config);
          setAppliedJobIds(appsRes.data.map(app => app.job?._id));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobsAndProfile();
  }, [user]);

  const handleApply = async (jobId) => {
    if (!user) {
      setApplyMessage({ type: 'error', text: 'Please login to apply' });
      return;
    }

    try {
      const userInfo = localStorage.getItem('userInfo');
      const token = userInfo ? JSON.parse(userInfo).token : '';

      await axios.post('http://localhost:5005/api/applications/apply', { jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppliedJobIds([...appliedJobIds, jobId]);
      setApplyMessage({ type: 'success', text: 'Successfully applied! Your profile has been sent to the recruiter.' });
      setTimeout(() => setApplyMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      setApplyMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error applying'
      });
      setTimeout(() => setApplyMessage({ type: '', text: '' }), 3000);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {applyMessage.text && (
        <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 text-white ${applyMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {applyMessage.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover your next internship or full-time role.</p>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by role or company..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => {
              const hasApplied = appliedJobIds.includes(job._id);
              return (
                <JobCard
                  key={job._id}
                  job={job}
                  onApply={handleApply}
                  isStudent={user?.role === 'student'}
                  hasApplied={hasApplied}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No jobs found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListings;
