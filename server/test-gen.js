const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGen() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const modelsToTest = ['gemini-2.0-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in one word');
      const response = await result.response;
      console.log(`SUCCESS ${modelName}: ${response.text()}`);
      return modelName;
    } catch (err) {
      console.error(`FAILED ${modelName}: ${err.message}`);
    }
  }
}

testGen();
