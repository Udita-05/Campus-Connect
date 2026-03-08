import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Building, MapPin, Briefcase, IndianRupee, Clock,
    ArrowLeft, CheckCircle, Zap, FileText, Star, X
} from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                const token = userInfo ? JSON.parse(userInfo).token : '';
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const { data } = await axios.get(`https://campus-connect-k0va.onrender.com/api/jobs/${id}`, config);
                setJob(data);
            } catch (err) {
                console.error('Error fetching job details', err);
                setError(err.response?.data?.message || 'Failed to load job details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error || !job) return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || 'Job not found'}</h2>
            <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={18} /> Back to Job Listings
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
                to="/applications"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-8 transition-colors"
            >
                <ArrowLeft size={16} /> Back to My Applications
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card overflow-hidden"
            >
                {/* Header Section */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {job.title}
                                </h1>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800/50">
                                    Active
                                </span>
                                {job.matchScore !== undefined && (
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
                                        ${job.matchScore >= 75 ? 'bg-emerald-500 text-white' :
                                            job.matchScore >= 40 ? 'bg-amber-400 text-white' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        <Zap size={12} fill="currentColor" /> {job.matchScore}% Match
                                    </div>
                                )}
                            </div>

                            {job.isEligible === false && (
                                <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl">
                                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest mb-1">
                                        <X size={14} /> Ineligible to Apply
                                    </div>
                                    <p className="text-xs text-rose-500 font-medium">
                                        {job.missingRequirements?.cgpa && <span>• Minimum CGPA: {job.minCGPA} required </span>}
                                        {job.missingRequirements?.branch && <span>• Restricted to: {job.allowedBranches?.join(', ')}</span>}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-lg mb-6">
                                <Building size={20} />
                                {job.companyName}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm font-medium">
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300">
                                    <Briefcase size={16} className="text-slate-400" /> {job.type}
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300">
                                    <MapPin size={16} className="text-slate-400" /> {job.location || 'Remote'}
                                </div>
                                {job.stipendOrSalary && (
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300">
                                        <IndianRupee size={16} className="text-slate-400" /> {job.stipendOrSalary}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300">
                                    <Clock size={16} className="text-slate-400" /> Posted on {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-10">
                    {/* Job Description */}
                    <div>
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
                            <FileText size={16} /> Job Description
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <div>
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
                                <Star size={16} /> Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {job.requirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                        <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default JobDetails;
