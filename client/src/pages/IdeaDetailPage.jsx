import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiPencil, HiTrash, HiDocumentReport } from 'react-icons/hi';
import { ideasAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import { formatDate, industryColors } from '../lib/utils';

const IdeaDetailPage = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [hasReport, setHasReport] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchIdea(); }, [id]);

  const fetchIdea = async () => {
    try {
      const res = await ideasAPI.getOne(id);
      setIdea(res.data.idea);
      setHasReport(res.data.hasReport);
      setReportId(res.data.reportId);
    } catch (error) { toast.error('Failed to load idea'); navigate('/ideas'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await ideasAPI.delete(id);
      toast.success('Idea deleted');
      navigate('/ideas');
    } catch (error) { toast.error('Failed to delete idea'); }
  };

  if (loading) return <Loader />;
  if (!idea) return null;

  const details = [
    { label: 'Industry', value: idea.industry },
    { label: 'Target Audience', value: idea.targetAudience },
    { label: 'Problem Solved', value: idea.problemSolved },
    { label: 'Revenue Model', value: idea.revenueModel },
    { label: 'Budget Estimate', value: idea.budgetEstimate },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${industryColors[idea.industry] || industryColors['Other']}`}>{idea.industry}</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-3">{idea.title}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Created {formatDate(idea.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/ideas/${id}/edit`} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm"><HiPencil className="w-4 h-4" /> Edit</Link>
            <button onClick={() => setDeleteModal(true)} className="btn-danger py-2 px-4 flex items-center gap-2 text-sm"><HiTrash className="w-4 h-4" /> Delete</button>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed">{idea.description}</p>
      </div>

      {/* Details Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {details.map(({ label, value }) => (
          <div key={label} className="glass-card p-5">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* AI Analysis CTA */}
      <div className="glass-card p-6 sm:p-8 text-center">
        {hasReport ? (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <HiDocumentReport className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-2">AI Report Available</h3>
            <p className="text-[var(--text-secondary)] mb-6">This idea has been analyzed. View the full report or re-analyze.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to={`/reports/${reportId}`} className="btn-primary flex items-center gap-2"><HiDocumentReport className="w-5 h-5" /> View Report</Link>
              <Link to={`/ideas/${id}/analyze`} className="btn-secondary flex items-center gap-2"><HiSparkles className="w-5 h-5" /> Re-Analyze</Link>
            </div>
          </div>
        ) : (
          <div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <HiSparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="font-heading font-bold text-xl mb-2">Ready for AI Analysis?</h3>
            <p className="text-[var(--text-secondary)] mb-6">Let our AI evaluate your idea and generate a comprehensive report with SWOT analysis, market potential, and more.</p>
            <Link to={`/ideas/${id}/analyze`} className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"><HiSparkles className="w-5 h-5" /> Analyze with AI</Link>
          </div>
        )}
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Idea">
        <p className="text-[var(--text-secondary)] mb-6">This will permanently delete this idea and any associated reports.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal(false)} className="btn-secondary py-2">Cancel</button>
          <button onClick={handleDelete} className="btn-danger py-2">Delete</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default IdeaDetailPage;
