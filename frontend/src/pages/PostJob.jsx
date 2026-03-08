import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, IndianRupee, CheckCircle, ArrowLeft, GraduationCap, Code2, Trash2 } from 'lucide-react';

const PostJob = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    stipendOrSalary: '',
    type: 'Internship',
    minCGPA: '',
    allowedBranches: '',
    tier: '3'
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5005/api/jobs/${id}`);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            requirements: Array.isArray(data.requirements) ? data.requirements.join(', ') : data.requirements || '',
            location: data.location || '',
            stipendOrSalary: data.stipendOrSalary || '',
            type: data.type || 'Internship',
            minCGPA: data.minCGPA || '',
            allowedBranches: Array.isArray(data.allowedBranches) ? data.allowedBranches.join(', ') : data.allowedBranches || '',
            tier: data.tier?.toString() || '3'
          });
        } catch (err) {
          setError('Failed to fetch job details');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const companyName = user.name;
      const reqArray = formData.requirements.split(',').map(r => r.trim()).filter(r => r);
      const branchArray = formData.allowedBranches.split(',').map(b => b.trim()).filter(b => b);

      const payload = {
        ...formData,
        companyName,
        requirements: reqArray,
        allowedBranches: branchArray,
        minCGPA: formData.minCGPA ? parseFloat(formData.minCGPA) : 0,
        tier: parseInt(formData.tier)
      };

      if (isEdit) {
        await axios.put(`http://localhost:5005/api/jobs/${id}`, payload);
        setSuccess('Job updated successfully!');
      } else {
        await axios.post('http://localhost:5005/api/jobs', payload);
        setSuccess('Job posted successfully!');
      }

      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'post'} job`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="text-center py-20 dark:text-white">Loading job details...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{isEdit ? 'Edit Job Posting' : 'Create Job Posting'}</h1>
          <p className="text-gray-600 dark:text-gray-400">{isEdit ? 'Update the details of your job opportunity.' : 'Fill in the details to publish a new job opportunity to students.'}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-6 flex items-center gap-2">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm mb-6 flex items-center gap-2">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Job Title*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-indigo-500" />
                </div>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field pl-12" placeholder="e.g. Software Engineer Intern" />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Job Description*</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[140px]" placeholder="Detailed description of the role, responsibilities, and team..." />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                </div>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field pl-12" placeholder="Remote, or City, Country" />
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Salary / Stipend</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-indigo-500" />
                </div>
                <input type="text" name="stipendOrSalary" value={formData.stipendOrSalary} onChange={handleChange} className="input-field pl-12" placeholder="₹20,000/month or 12 LPA" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Job Type*</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            {/* Tier */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Company Tier*</label>
              <select name="tier" value={formData.tier} onChange={handleChange} className="input-field">
                <option value="1">Tier 1 (Dream)</option>
                <option value="2">Tier 2 (Core)</option>
                <option value="3">Tier 3 (Mass)</option>
              </select>
            </div>

            {/* Min CGPA */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Minimum CGPA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                </div>
                <input type="number" step="0.01" name="minCGPA" value={formData.minCGPA} onChange={handleChange} className="input-field pl-12" placeholder="e.g. 7.5" />
              </div>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Required Skills (Comma separated)*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Code2 className="h-5 w-5 text-indigo-500" />
                </div>
                <input required type="text" name="requirements" value={formData.requirements} onChange={handleChange} className="input-field pl-12" placeholder="React, Node.js, Python, CSS" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest pl-1">Matching algorithm will prioritize these skills</p>
            </div>

            {/* Branches */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide text-[11px]">Allowed Branches (Comma separated)</label>
              <input type="text" name="allowedBranches" value={formData.allowedBranches} onChange={handleChange} className="input-field" placeholder="Computer Science, Information Technology, ECE" />
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest pl-1">Leave blank to allow all branches</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex justify-center items-center gap-2 py-4 px-10 text-md font-bold w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
            >
              {loading ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Update Intelligence Job' : 'Publish Intelligence Job')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
