const express = require('express');
const AIReport = require('../models/AIReport');
const StartupIdea = require('../models/StartupIdea');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/reports - Get all reports for current user
router.get('/', async (req, res) => {
  try {
    const reports = await AIReport.find({ userId: req.user._id })
      .populate('startupIdeaId', 'title industry budgetEstimate')
      .sort('-generatedAt')
      .lean();

    res.json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
});

// GET /api/reports/:id - Get single report
router.get('/:id', async (req, res) => {
  try {
    const report = await AIReport.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('startupIdeaId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message
    });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete('/:id', async (req, res) => {
  try {
    const report = await AIReport.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update idea's hasReport status
    const otherReports = await AIReport.countDocuments({ startupIdeaId: report.startupIdeaId });
    if (otherReports === 0) {
      await StartupIdea.findByIdAndUpdate(report.startupIdeaId, { hasReport: false });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
});

// GET /api/reports/stats/dashboard - Get dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalIdeas = await StartupIdea.countDocuments({ createdBy: req.user._id });
    const totalReports = await AIReport.countDocuments({ userId: req.user._id });
    
    const reports = await AIReport.find({ userId: req.user._id })
      .select('startupScore generatedAt')
      .lean();
    
    const avgScore = reports.length > 0
      ? (reports.reduce((sum, r) => sum + r.startupScore, 0) / reports.length).toFixed(1)
      : 0;

    const recentIdeas = await StartupIdea.find({ createdBy: req.user._id })
      .sort('-createdAt')
      .limit(5)
      .lean();

    // Get scores for recent ideas
    const recentIdeaIds = recentIdeas.map(i => i._id);
    const recentReports = await AIReport.find({ startupIdeaId: { $in: recentIdeaIds } })
      .select('startupIdeaId startupScore')
      .lean();
    const scoreMap = {};
    recentReports.forEach(r => { scoreMap[r.startupIdeaId.toString()] = r.startupScore; });
    const recentIdeasWithScores = recentIdeas.map(idea => ({
      ...idea,
      startupScore: scoreMap[idea._id.toString()] || null
    }));

    // Industry distribution
    const industryStats = await StartupIdea.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Score distribution
    const scoreDistribution = await AIReport.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$startupScore', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalIdeas,
        totalReports,
        avgScore: parseFloat(avgScore),
        recentIdeas: recentIdeasWithScores,
        industryStats,
        scoreDistribution,
        scores: reports.map(r => ({ score: r.startupScore, date: r.generatedAt }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

module.exports = router;
