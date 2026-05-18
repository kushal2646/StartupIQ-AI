import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDownload, HiArrowLeft } from 'react-icons/hi';
import { reportsAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';
import ScoreGauge from '../components/ui/ScoreGauge';
import { formatDate } from '../lib/utils';
import jsPDF from 'jspdf';

const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchReport(); }, [id]);

  const fetchReport = async () => {
    try {
      const res = await reportsAPI.getOne(id);
      setReport(res.data.report);
    } catch (error) { toast.error('Failed to load report'); navigate('/reports'); }
    finally { setLoading(false); }
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    let y = 20;
    const addText = (text, size = 10, bold = false) => {
      doc.setFontSize(size);
      doc.setFont(undefined, bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, 170);
      lines.forEach(line => { if (y > 270) { doc.addPage(); y = 20; } doc.text(line, 20, y); y += 7; });
    };
    addText('StartupIQ AI - Analysis Report', 20, true); y += 4;
    if (report.aiGeneratedName) addText(`Name: ${report.aiGeneratedName}`, 14, true);
    addText(`Score: ${report.startupScore}/10`, 14, true); y += 4;
    addText('Summary', 14, true); addText(report.startupSummary); y += 2;
    ['strengths','weaknesses','opportunities','threats'].forEach(k => {
      addText(k.charAt(0).toUpperCase() + k.slice(1), 12, true);
      (report.swotAnalysis?.[k] || []).forEach(item => addText(`• ${item}`));
      y += 2;
    });
    addText('Market Potential', 14, true); addText(report.marketPotential); y += 2;
    addText('Revenue Suggestions', 14, true); addText(report.revenueSuggestions); y += 2;
    addText('Growth Strategy', 14, true); addText(report.growthStrategy); y += 2;
    addText('Investor Pitch', 14, true); addText(report.investorPitch);
    doc.save(`StartupIQ-Report.pdf`);
    toast.success('PDF exported!');
  };

  if (loading) return <Loader />;
  if (!report) return null;

  const swotItems = [
    { title: 'Strengths', items: report.swotAnalysis?.strengths, bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Weaknesses', items: report.swotAnalysis?.weaknesses, bg: 'bg-red-50 dark:bg-red-900/20', color: 'text-red-600 dark:text-red-400' },
    { title: 'Opportunities', items: report.swotAnalysis?.opportunities, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Threats', items: report.swotAnalysis?.threats, bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate('/reports')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-primary-500 transition-colors">
        <HiArrowLeft className="w-5 h-5" /> Back to Reports
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
        <h1 className="text-3xl font-heading font-bold gradient-text mb-1">{report.aiGeneratedName || 'Analysis Report'}</h1>
        {report.aiGeneratedTagline && <p className="text-[var(--text-secondary)] italic mb-4">"{report.aiGeneratedTagline}"</p>}
        <p className="text-xs text-[var(--text-muted)] mb-6">Generated {formatDate(report.generatedAt)}</p>
        <ScoreGauge score={report.startupScore} size={140} />
        <button onClick={exportPDF} className="btn-primary flex items-center gap-2 mx-auto mt-6"><HiDownload className="w-5 h-5" /> Export PDF</button>
      </motion.div>

      {/* Summary */}
      <div className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-3">📋 Executive Summary</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">{report.startupSummary}</p>
      </div>

      {/* SWOT */}
      <div>
        <h2 className="font-heading font-bold text-xl mb-4">📊 SWOT Analysis</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {swotItems.map((section) => (
            <div key={section.title} className={`rounded-2xl p-5 ${section.bg}`}>
              <h3 className={`font-heading font-bold mb-3 ${section.color}`}>{section.title}</h3>
              <ul className="space-y-2">
                {(section.items || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6"><h2 className="font-heading font-bold text-xl mb-3">🌍 Market Potential</h2><p className="text-[var(--text-secondary)] leading-relaxed">{report.marketPotential}</p></div>

      <div className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-4">🏢 Competitors</h2>
        <div className="space-y-3">
          {(report.competitors || []).map((comp, i) => (
            <div key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <p className="font-semibold">{comp.name}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{comp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6"><h2 className="font-heading font-bold text-xl mb-3">💰 Revenue</h2><p className="text-[var(--text-secondary)] text-sm leading-relaxed">{report.revenueSuggestions}</p></div>
        <div className="glass-card p-6"><h2 className="font-heading font-bold text-xl mb-3">🚀 Growth</h2><p className="text-[var(--text-secondary)] text-sm leading-relaxed">{report.growthStrategy}</p></div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-3">⚠️ Risks</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {(report.risksAndChallenges || []).map((risk, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10"><span className="text-amber-500">⚡</span><span className="text-sm">{risk}</span></div>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
        <h2 className="font-heading font-bold text-xl mb-3">🎤 Investor Pitch</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed italic text-lg">"{report.investorPitch}"</p>
      </div>
    </div>
  );
};

export default ReportDetailPage;
