import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLightBulb } from 'react-icons/hi';
import { ideasAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { industries, revenueModels, budgetEstimates } from '../lib/utils';

const NewIdeaPage = () => {
  const [form, setForm] = useState({ title: '', description: '', industry: '', targetAudience: '', problemSolved: '', revenueModel: '', budgetEstimate: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) { toast.error(`Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`); return; }
    }
    setLoading(true);
    try {
      const res = await ideasAPI.create(form);
      toast.success('Startup idea created! 🎉');
      navigate(`/ideas/${res.data.idea._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create idea');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
          <HiLightBulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">New Startup Idea</h1>
          <p className="text-sm text-[var(--text-muted)]">Fill in the details of your startup concept</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Startup Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g., EcoTrack - Carbon Footprint Tracker" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Describe your startup idea in detail..." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Industry *</label>
            <select name="industry" value={form.industry} onChange={handleChange} className="input-field">
              <option value="">Select industry</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Revenue Model *</label>
            <select name="revenueModel" value={form.revenueModel} onChange={handleChange} className="input-field">
              <option value="">Select revenue model</option>
              {revenueModels.map(rm => <option key={rm} value={rm}>{rm}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Target Audience *</label>
          <input name="targetAudience" value={form.targetAudience} onChange={handleChange} className="input-field" placeholder="e.g., Environmentally conscious millennials aged 25-40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Problem Being Solved *</label>
          <textarea name="problemSolved" value={form.problemSolved} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="What specific problem does your startup solve?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Budget Estimate *</label>
          <select name="budgetEstimate" value={form.budgetEstimate} onChange={handleChange} className="input-field">
            <option value="">Select budget range</option>
            {budgetEstimates.map(be => <option key={be} value={be}>{be}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate('/ideas')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Idea'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewIdeaPage;
