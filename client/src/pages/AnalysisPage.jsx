import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiDocumentReport, HiDownload } from 'react-icons/hi';
import { aiAPI, reportsAPI } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { AILoader } from '../components/ui/Loader';
import ScoreGauge from '../components/ui/ScoreGauge';
import jsPDF from 'jspdf';

const AnalysisPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { checkExistingReport(); }, [id]);

  const checkExistingReport = async () => {
    try {
      const res = await reportsAPI.getAll();
      const existing = res.data.reports.find(r => r.startupIdeaId?._id === id || r.startupIdeaId === id);
      if (existing) {
        const fullReport = await reportsAPI.getOne(existing._id);
        setReport(fullReport.data.report);
      } else {
        startAnalysis();
      }
    } catch (error) { startAnalysis(); }
    finally { setLoading(false); }
  };

  const startAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await aiAPI.analyze(id);
      setReport(res.data.report);
      toast.success('AI analysis complete! 🎉');
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI analysis failed. Please try again.');
      navigate(`/ideas/${id}`);
    } finally { setAnalyzing(false); }
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    const addText = (text, size = 10, bold = false) => {
      doc.setFontSize(size);
      if (bold) doc.setFont(undefined, 'bold');
      else doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    };

    const addSection = (title, content) => {
      y += 4;
      addText(title, 14, true);
      y += 2;
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (typeof item === 'string') addText(`• ${item}`);
          else if (item.name) addText(`• ${item.name}: ${item.description}`);
        });
      } else {
        addText(content || 'N/A');
      }
    };

    addText('StartupIQ AI - Analysis Report', 20, true);
    y += 4;
    if (report.aiGeneratedName) addText(`Suggested Name: ${report.aiGeneratedName}`, 12, true);
    if (report.aiGeneratedTagline) addText(`"${report.aiGeneratedTagline}"`, 10);
    addText(`Score: ${report.startupScore}/10`, 14, true);
    y += 4;

    addSection('Executive Summary', report.startupSummary);
    addSection('Strengths', report.swotAnalysis?.strengths);
    addSection('Weaknesses', report.swotAnalysis?.weaknesses);
    addSection('Opportunities', report.swotAnalysis?.opportunities);
    addSection('Threats', report.swotAnalysis?.threats);
    addSection('Market Potential', report.marketPotential);
    addSection('Competitors', report.competitors);
    addSection('Revenue Suggestions', report.revenueSuggestions);
    addSection('Growth Strategy', report.growthStrategy);
    addSection('Risks & Challenges', report.risksAndChallenges);
    addSection('Investor Pitch', report.investorPitch);

    doc.save(`StartupIQ-Report-${report.aiGeneratedName || 'analysis'}.pdf`);
    toast.success('PDF exported! 📄');
  };

  if (loading || analyzing) return <AILoader />;
  if (!report) return null;

  const swotItems = [
    { title: 'Strengths', items: report.swotAnalysis?.strengths, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Weaknesses', items: report.swotAnalysis?.weaknesses, color: 'from-red-500 to-rose-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { title: 'Opportunities', items: report.swotAnalysis?.opportunities, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Threats', items: report.swotAnalysis?.threats, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8 text-center">
        {report.aiGeneratedName && <p className="text-sm font-semibold text-primary-500 mb-1">AI Suggested Name</p>}
        <h1 className="text-3xl font-heading font-bold gradient-text mb-1">{report.aiGeneratedName || 'Analysis Report'}</h1>
        {report.aiGeneratedTagline && <p className="text-[var(--text-secondary)] italic mb-6">"{report.aiGeneratedTagline}"</p>}
        <ScoreGauge score={report.startupScore} size={140} />
        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <button onClick={exportPDF} className="btn-primary flex items-center gap-2"><HiDownload className="w-5 h-5" /> Export PDF</button>
          <button onClick={startAnalysis} className="btn-secondary flex items-center gap-2"><HiSparkles className="w-5 h-5" /> Re-Analyze</button>
          <Link to="/reports" className="btn-secondary flex items-center gap-2"><HiDocumentReport className="w-5 h-5" /> All Reports</Link>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-3">📋 Executive Summary</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">{report.startupSummary}</p>
      </motion.div>

      {/* SWOT Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-heading font-bold text-xl mb-4">📊 SWOT Analysis</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {swotItems.map((section) => (
            <div key={section.title} className={`rounded-2xl p-5 ${section.bg}`}>
              <h3 className={`font-heading font-bold mb-3 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>{section.title}</h3>
              <ul className="space-y-2">
                {(section.items || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Potential */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-3">🌍 Market Potential</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">{report.marketPotential}</p>
      </motion.div>

      {/* Competitors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-4">🏢 Competitor Analysis</h2>
        <div className="space-y-3">
          {(report.competitors || []).map((comp, i) => (
            <div key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <p className="font-semibold">{comp.name}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{comp.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Revenue & Growth */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h2 className="font-heading font-bold text-xl mb-3">💰 Revenue Suggestions</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{report.revenueSuggestions}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h2 className="font-heading font-bold text-xl mb-3">🚀 Growth Strategy</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{report.growthStrategy}</p>
        </motion.div>
      </div>

      {/* Risks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6">
        <h2 className="font-heading font-bold text-xl mb-3">⚠️ Risks & Challenges</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {(report.risksAndChallenges || []).map((risk, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
              <span className="text-amber-500 mt-0.5">⚡</span>
              <span className="text-sm">{risk}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Investor Pitch */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-6 sm:p-8 bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
        <h2 className="font-heading font-bold text-xl mb-3">🎤 Investor Pitch</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed italic text-lg">"{report.investorPitch}"</p>
      </motion.div>
    </div>
  );
};

export default AnalysisPage;
