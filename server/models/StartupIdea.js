const mongoose = require('mongoose');

const startupIdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Startup title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
      'Food & Beverage', 'Real Estate', 'Transportation', 'Entertainment',
      'Social Media', 'AI & Machine Learning', 'Blockchain', 'SaaS',
      'CleanTech', 'AgriTech', 'Gaming', 'Travel', 'Fashion', 'Other'
    ]
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    trim: true
  },
  problemSolved: {
    type: String,
    required: [true, 'Problem solved is required'],
    trim: true
  },
  revenueModel: {
    type: String,
    required: [true, 'Revenue model is required'],
    enum: [
      'Subscription', 'Freemium', 'Marketplace', 'Advertising',
      'Transaction Fee', 'Licensing', 'Pay-per-use', 'Affiliate',
      'Hardware Sales', 'Data Monetization', 'Other'
    ]
  },
  budgetEstimate: {
    type: String,
    required: [true, 'Budget estimate is required'],
    enum: [
      'Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000',
      '$10,000 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000',
      '$500,000 - $1M', 'Over $1M'
    ]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hasReport: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
startupIdeaSchema.index({ title: 'text', description: 'text' });
startupIdeaSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('StartupIdea', startupIdeaSchema);
