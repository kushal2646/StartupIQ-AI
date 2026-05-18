const express = require('express');
const StartupIdea = require('../models/StartupIdea');
const AIReport = require('../models/AIReport');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/ideas - Get all ideas for current user
router.get('/', async (req, res) => {
  try {
    const { search, industry, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    
    const query = { createdBy: req.user._id };
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by industry
    if (industry && industry !== 'All') {
      query.industry = industry;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await StartupIdea.countDocuments(query);
    
    const ideas = await StartupIdea.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get scores for ideas that have reports
    const ideaIds = ideas.map(i => i._id);
    const reports = await AIReport.find({ startupIdeaId: { $in: ideaIds } })
      .select('startupIdeaId startupScore')
      .lean();
    
    const scoreMap = {};
    reports.forEach(r => {
      scoreMap[r.startupIdeaId.toString()] = r.startupScore;
    });

    const ideasWithScores = ideas.map(idea => ({
      ...idea,
      startupScore: scoreMap[idea._id.toString()] || null
    }));

    res.json({
      success: true,
      ideas: ideasWithScores,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ideas',
      error: error.message
    });
  }
});

// GET /api/ideas/:id - Get single idea
router.get('/:id', async (req, res) => {
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

    // Check if report exists
    const report = await AIReport.findOne({ startupIdeaId: idea._id });

    res.json({
      success: true,
      idea,
      hasReport: !!report,
      reportId: report ? report._id : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch idea',
      error: error.message
    });
  }
});

// POST /api/ideas - Create new idea
router.post('/', async (req, res) => {
  try {
    const { title, description, industry, targetAudience, problemSolved, revenueModel, budgetEstimate } = req.body;

    const idea = await StartupIdea.create({
      title,
      description,
      industry,
      targetAudience,
      problemSolved,
      revenueModel,
      budgetEstimate,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Startup idea created successfully',
      idea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create idea',
      error: error.message
    });
  }
});

// PUT /api/ideas/:id - Update idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await StartupIdea.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found'
      });
    }

    res.json({
      success: true,
      message: 'Startup idea updated successfully',
      idea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update idea',
      error: error.message
    });
  }
});

// DELETE /api/ideas/:id - Delete idea and associated reports
router.delete('/:id', async (req, res) => {
  try {
    const idea = await StartupIdea.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found'
      });
    }

    // Delete associated reports
    await AIReport.deleteMany({ startupIdeaId: req.params.id });

    res.json({
      success: true,
      message: 'Startup idea and associated reports deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete idea',
      error: error.message
    });
  }
});

module.exports = router;
