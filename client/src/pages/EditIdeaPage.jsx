import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPencil } from 'react-icons/hi';
import { ideasAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';
import { industries, revenueModels, budgetEstimates } from '../lib/utils';

const EditIdeaPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', industry: '', targetAudience: '', problemSolved: '', revenueModel: '', budgetEstimate: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchIdea(); }, [id]);

  const fetchIdea = async () => {
    try {
      const res = await ideasAPI.getOne(id);
      const idea = res.data.idea;
      setForm({ title: idea.title, description: idea.description, industry: idea.industry, targetAudience: idea.targetAudience, problemSolved: idea.problemSolved, revenueModel: idea.revenueModel, budgetEstimate: idea.budgetEstimate });
    } catch (error) { toast.error('Failed to load idea'); navigate('/ideas'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await ideasAPI.update(id, form);
      toast.success('Idea updated successfully! ✅');
      navigate(`/ideas/${id}`);
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to update idea'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <HiPencil className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Edit Idea</h1>
          <p className="text-sm text-[var(--text-muted)]">Update your startup concept details</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Startup Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select name="industry" value={form.industry} onChange={handleChange} className="input-field">
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Revenue Model</label>
            <select name="revenueModel" value={form.revenueModel} onChange={handleChange} className="input-field">
              {revenueModels.map(rm => <option key={rm} value={rm}>{rm}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Target Audience</label>
          <input name="targetAudience" value={form.targetAudience} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Problem Being Solved</label>
          <textarea name="problemSolved" value={form.problemSolved} onChange={handleChange} rows={3} className="input-field resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Budget Estimate</label>
          <select name="budgetEstimate" value={form.budgetEstimate} onChange={handleChange} className="input-field">
            {budgetEstimates.map(be => <option key={be} value={be}>{be}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate(`/ideas/${id}`)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditIdeaPage;
