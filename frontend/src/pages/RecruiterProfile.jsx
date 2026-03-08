import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Building, User, Edit2, Save } from 'lucide-react';

const RecruiterProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    description: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('https://campus-connect-k0va.onrender.com/api/profile/recruiter');
        setProfile(data);
        setFormData({
          companyName: data.companyName || '',
          description: data.description || ''
        });
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('https://campus-connect-k0va.onrender.com/api/profile/recruiter', formData);
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-4xl font-bold">
              <Building size={40} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{profile?.companyName || user?.name || 'Company Name'}</h1>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                <User size={16} /> Recruiter Account
              </p>
              <p className="text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
          >
            {isEditing ? <Edit2 size={20} className="text-primary-600" /> : <Edit2 size={20} />}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="input-field pl-10" placeholder="e.g. Acme Corp" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="5" placeholder="Tell candidates about your company's mission and culture..." />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save Details</button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About the Company</h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                {profile?.description ? (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{profile.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description provided yet. Click the edit icon to add details about your company.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RecruiterProfile;
