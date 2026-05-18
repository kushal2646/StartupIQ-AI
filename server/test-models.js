const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("AVAILABLE MODELS FOR THIS API KEY:");
      data.models.forEach(model => {
        if (model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`- ${model.name}`);
        }
      });
    } else {
      console.log("Error listing models:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

listModels();
