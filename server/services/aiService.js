const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeStartup = async (idea) => {
  try {
    // gemini-pro is universally available on v1beta for all free API keys
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert startup analyst and venture capital advisor. Analyze the following startup idea and provide a comprehensive evaluation report.

STARTUP IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Industry: ${idea.industry}
- Target Audience: ${idea.targetAudience}
- Problem Being Solved: ${idea.problemSolved}
- Revenue Model: ${idea.revenueModel}
- Budget Estimate: ${idea.budgetEstimate}

Please provide your analysis in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
  "startupSummary": "A compelling 3-4 sentence executive summary of this startup idea",
  "swotAnalysis": {
    "strengths": ["strength1", "strength2", "strength3", "strength4"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
    "threats": ["threat1", "threat2", "threat3"]
  },
  "marketPotential": "Detailed paragraph about market size, growth potential, TAM/SAM/SOM estimates, and market trends",
  "competitors": [
    {"name": "Competitor 1", "description": "Brief description of how they compare"},
    {"name": "Competitor 2", "description": "Brief description of how they compare"},
    {"name": "Competitor 3", "description": "Brief description of how they compare"}
  ],
  "revenueSuggestions": "Detailed paragraph with specific revenue strategies, pricing models, and monetization approaches",
  "growthStrategy": "Detailed paragraph with growth hacking strategies, marketing channels, and scaling approaches",
  "startupScore": 7,
  "risksAndChallenges": ["risk1", "risk2", "risk3", "risk4"],
  "investorPitch": "A compelling 4-5 sentence investor pitch that could be used in a pitch deck",
  "aiGeneratedName": "A creative, memorable startup name suggestion",
  "aiGeneratedTagline": "A catchy, memorable tagline for the startup"
}

IMPORTANT: 
- The startupScore must be an integer between 1 and 10
- Be specific and detailed in each section
- Provide actionable insights
- Be realistic but constructive
- Return ONLY valid JSON, no additional text`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove any markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    if (!text) throw new Error('Empty response from AI model');

    const analysis = JSON.parse(text);

    // Validate and clamp the score
    if (typeof analysis.startupScore !== 'number' || analysis.startupScore < 1 || analysis.startupScore > 10) {
      analysis.startupScore = 5;
    }
    analysis.startupScore = Math.round(analysis.startupScore);

    return analysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

module.exports = { analyzeStartup };
