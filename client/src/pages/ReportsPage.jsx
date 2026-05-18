import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDocumentReport, HiTrash, HiSparkles } from 'react-icons/hi';
import { reportsAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { formatDate, getScoreColor } from '../lib/utils';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const toast = useToast();

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await reportsAPI.getAll();
      setReports(res.data.reports);
    } catch (error) { toast.error('Failed to fetch reports'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await reportsAPI.delete(deleteModal);
      setReports(prev => prev.filter(r => r._id !== deleteModal));
      toast.success('Report deleted');
      setDeleteModal(null);
    } catch (error) { toast.error('Failed to delete report'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">AI Reports</h1>
        <p className="text-sm text-[var(--text-muted)]">{reports.length} reports generated</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={HiDocumentReport} title="No reports yet" description="Analyze a startup idea to generate your first AI report"
          action={<Link to="/ideas" className="btn-primary flex items-center gap-2"><HiSparkles className="w-5 h-5" /> Go to Ideas</Link>} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, i) => (
            <motion.div key={report._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-6 group hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <HiDocumentReport className="w-5 h-5 text-white" />
                </div>
                <span className={`text-2xl font-heading font-bold ${getScoreColor(report.startupScore)}`}>{report.startupScore}/10</span>
              </div>
              <h3 className="font-heading font-bold mb-1 line-clamp-1">{report.aiGeneratedName || report.startupIdeaId?.title || 'Report'}</h3>
              {report.aiGeneratedTagline && <p className="text-xs text-[var(--text-muted)] italic mb-2 line-clamp-1">"{report.aiGeneratedTagline}"</p>}
              <p className="text-xs text-[var(--text-muted)]">{report.startupIdeaId?.industry} · {formatDate(report.generatedAt)}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border-color)]">
                <Link to={`/reports/${report._id}`} className="flex-1 text-center py-2 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors">View Report</Link>
                <button onClick={() => setDeleteModal(report._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Report">
        <p className="text-[var(--text-secondary)] mb-6">Are you sure you want to delete this report?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal(null)} className="btn-secondary py-2">Cancel</button>
          <button onClick={handleDelete} className="btn-danger py-2">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;
