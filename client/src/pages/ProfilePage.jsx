import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiSave } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../lib/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name, email });
      updateUser(res.data.user);
      toast.success('Profile updated! ✅');
    } catch (error) { toast.error(error.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-8 text-center">
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=128&bold=true`}
          alt={user?.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-primary-500/30"
        />
        <h1 className="text-2xl font-heading font-bold">{user?.name}</h1>
        <p className="text-[var(--text-muted)]">{user?.email}</p>
        <p className="text-xs text-[var(--text-muted)] mt-2">Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
      </div>

      {/* Edit Form */}
      <div className="glass-card p-6 sm:p-8">
        <h2 className="font-heading font-bold text-xl mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-12" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><HiSave className="w-5 h-5" /> Save Changes</>}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
