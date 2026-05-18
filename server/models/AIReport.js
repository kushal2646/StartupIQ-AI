const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema({
  startupIdeaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupIdea',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startupSummary: {
    type: String,
    required: true
  },
  swotAnalysis: {
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    threats: [String]
  },
  marketPotential: {
    type: String,
    required: true
  },
  competitors: [{
    name: String,
    description: String
  }],
  revenueSuggestions: {
    type: String,
    required: true
  },
  growthStrategy: {
    type: String,
    required: true
  },
  startupScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  risksAndChallenges: [String],
  investorPitch: {
    type: String,
    required: true
  },
  aiGeneratedName: {
    type: String
  },
  aiGeneratedTagline: {
    type: String
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

aiReportSchema.index({ userId: 1, generatedAt: -1 });
aiReportSchema.index({ startupIdeaId: 1 });

module.exports = mongoose.model('AIReport', aiReportSchema);
