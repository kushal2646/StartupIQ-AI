import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus, HiSearch, HiFilter, HiLightBulb, HiTrash, HiPencil, HiSparkles } from 'react-icons/hi';
import { ideasAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { formatDate, getScoreColor, industryColors, truncateText, industries } from '../lib/utils';

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [deleteModal, setDeleteModal] = useState(null);
  const toast = useToast();

  useEffect(() => { fetchIdeas(); }, [search, industry]);

  const fetchIdeas = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (industry !== 'All') params.industry = industry;
      const res = await ideasAPI.getAll(params);
      setIdeas(res.data.ideas);
    } catch (error) {
      toast.error('Failed to fetch ideas');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await ideasAPI.delete(deleteModal);
      setIdeas(prev => prev.filter(i => i._id !== deleteModal));
      toast.success('Idea deleted successfully');
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete idea');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">My Startup Ideas</h1>
          <p className="text-sm text-[var(--text-muted)]">{ideas.length} ideas total</p>
        </div>
        <Link to="/ideas/new" className="btn-primary flex items-center gap-2 w-fit">
          <HiPlus className="w-5 h-5" /> New Idea
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" placeholder="Search ideas..." />
        </div>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="input-field w-full sm:w-48">
          <option value="All">All Industries</option>
          {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
        </select>
      </div>

      {/* Ideas Grid */}
      {ideas.length === 0 ? (
        <EmptyState title="No ideas yet" description="Create your first startup idea and let AI analyze it!" action={<Link to="/ideas/new" className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Create Idea</Link>} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea, i) => (
            <motion.div key={idea._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 group hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${industryColors[idea.industry] || industryColors['Other']}`}>{idea.industry}</span>
                {idea.startupScore && <span className={`text-lg font-heading font-bold ${getScoreColor(idea.startupScore)}`}>{idea.startupScore}/10</span>}
              </div>
              <Link to={`/ideas/${idea._id}`}>
                <h3 className="font-heading font-bold text-lg mb-2 hover:text-primary-500 transition-colors line-clamp-1">{idea.title}</h3>
              </Link>
              <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{truncateText(idea.description, 100)}</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">{formatDate(idea.createdAt)}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">
                <Link to={`/ideas/${idea._id}`} className="flex-1 text-center py-2 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors">View</Link>
                <Link to={`/ideas/${idea._id}/edit`} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"><HiPencil className="w-4 h-4" /></Link>
                {idea.hasReport ? (
                  <Link to={`/ideas/${idea._id}/analyze`} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-primary-500"><HiSparkles className="w-4 h-4" /></Link>
                ) : null}
                <button onClick={() => setDeleteModal(idea._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Idea">
        <p className="text-[var(--text-secondary)] mb-6">Are you sure? This will also delete any associated AI reports. This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal(null)} className="btn-secondary py-2">Cancel</button>
          <button onClick={handleDelete} className="btn-danger py-2">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default IdeasPage;
