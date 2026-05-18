import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLightBulb, HiDocumentReport, HiTrendingUp, HiPlus } from 'react-icons/hi';
import { reportsAPI } from '../lib/api';
import { Loader } from '../components/ui/Loader';
import { formatDate, getScoreColor } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#f97316'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await reportsAPI.getDashboardStats();
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally { setLoading(false); }
  };

  if (loading) return <Loader text="Loading dashboard..." />;

  const statCards = [
    { label: 'Total Ideas', value: stats?.totalIdeas || 0, icon: HiLightBulb, color: 'from-primary-500 to-primary-600' },
    { label: 'AI Reports', value: stats?.totalReports || 0, icon: HiDocumentReport, color: 'from-secondary-500 to-secondary-600' },
    { label: 'Avg Score', value: stats?.avgScore || '—', icon: HiTrendingUp, color: 'from-accent-500 to-accent-600' },
  ];

  const industryData = (stats?.industryStats || []).map(item => ({ name: item._id, value: item.count }));
  const scoreData = (stats?.scoreDistribution || []).map(item => ({ score: `${item._id}/10`, count: item.count }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
                <p className="text-3xl font-heading font-bold mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Link to="/ideas/new" className="glass-card p-6 flex items-center gap-4 group hover:border-primary-500/30 transition-all cursor-pointer block">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold">Create New Startup Idea</h3>
            <p className="text-sm text-[var(--text-muted)]">Start validating your next big idea with AI</p>
          </div>
        </Link>
      </motion.div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {industryData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h3 className="font-heading font-bold mb-4">Ideas by Industry</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={industryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {industryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {scoreData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <h3 className="font-heading font-bold mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="score" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Recent Ideas */}
      {stats?.recentIdeas?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold">Recent Ideas</h3>
            <Link to="/ideas" className="text-sm text-primary-500 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {stats.recentIdeas.map((idea) => (
              <Link key={idea._id} to={`/ideas/${idea._id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <HiLightBulb className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{idea.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{idea.industry} · {formatDate(idea.createdAt)}</p>
                  </div>
                </div>
                {idea.startupScore && (
                  <span className={`font-bold font-heading ${getScoreColor(idea.startupScore)}`}>{idea.startupScore}/10</span>
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
