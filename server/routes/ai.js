const express = require('express');
const StartupIdea = require('../models/StartupIdea');
const AIReport = require('../models/AIReport');
const auth = require('../middleware/auth');
const { analyzeStartup } = require('../services/aiService');

const router = express.Router();

router.use(auth);

// POST /api/ai/analyze/:id - Analyze a startup idea with AI
router.post('/analyze/:id', async (req, res) => {
  try {
    const idea = await StartupIdea.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found'
      });
    }

    // Delete any existing report for this idea (re-analyze)
    await AIReport.deleteMany({ startupIdeaId: idea._id });

    // Call AI service
    const analysis = await analyzeStartup(idea);

    // Save report
    const report = await AIReport.create({
      startupIdeaId: idea._id,
      userId: req.user._id,
      startupSummary: analysis.startupSummary,
      swotAnalysis: analysis.swotAnalysis,
      marketPotential: analysis.marketPotential,
      competitors: analysis.competitors,
      revenueSuggestions: analysis.revenueSuggestions,
      growthStrategy: analysis.growthStrategy,
      startupScore: analysis.startupScore,
      risksAndChallenges: analysis.risksAndChallenges,
      investorPitch: analysis.investorPitch,
      aiGeneratedName: analysis.aiGeneratedName,
      aiGeneratedTagline: analysis.aiGeneratedTagline
    });

    // Mark idea as having a report
    idea.hasReport = true;
    await idea.save();

    res.json({
      success: true,
      message: 'AI analysis completed successfully',
      report
    });
  } catch (error) {
    console.error('AI Analysis Route Error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed. Please try again.',
      error: error.message
    });
  }
});

module.exports = router;
