export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getScoreColor = (score) => {
  if (score >= 8) return 'text-emerald-500';
  if (score >= 6) return 'text-yellow-500';
  if (score >= 4) return 'text-orange-500';
  return 'text-red-500';
};

export const getScoreBgColor = (score) => {
  if (score >= 8) return 'bg-emerald-500';
  if (score >= 6) return 'bg-yellow-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getScoreLabel = (score) => {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Average';
  if (score >= 4) return 'Below Average';
  if (score >= 3) return 'Needs Work';
  return 'Poor';
};

export const industryColors = {
  'Technology': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Healthcare': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Finance': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Education': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'E-commerce': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Food & Beverage': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Real Estate': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Transportation': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Entertainment': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Social Media': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'AI & Machine Learning': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Blockchain': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'SaaS': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'CleanTech': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  'AgriTech': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Gaming': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'Travel': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Fashion': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Other': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Food & Beverage', 'Real Estate', 'Transportation', 'Entertainment',
  'Social Media', 'AI & Machine Learning', 'Blockchain', 'SaaS',
  'CleanTech', 'AgriTech', 'Gaming', 'Travel', 'Fashion', 'Other'
];

export const revenueModels = [
  'Subscription', 'Freemium', 'Marketplace', 'Advertising',
  'Transaction Fee', 'Licensing', 'Pay-per-use', 'Affiliate',
  'Hardware Sales', 'Data Monetization', 'Other'
];

export const budgetEstimates = [
  'Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000',
  '$10,000 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000',
  '$500,000 - $1M', 'Over $1M'
];
