const axios = require("axios");
const OpenAI = require("openai"); // Example API (Google Dialogflow can also be used)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function processVoiceCommand(voiceText, userId) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Extract expense details from: "${voiceText}" in format: amount, category, description.`,
      max_tokens: 50,
    });

    const extractedData = response.data.choices[0].text.trim().split(", ");
    const amount = parseFloat(extractedData[0]);
    const category = extractedData[1];
    const description = extractedData[2];

    // Call backend API to store expense
    await axios.post("http://localhost:5000/api/expenses", {
      user: userId,
      amount,
      category,
      description,
      voiceEntry: voiceText,
    });

    return "Expense added successfully!";
  } catch (error) {
    console.error("Voice processing failed:", error);
    return "Sorry, I couldn't understand that.";
  }
}

module.exports = { processVoiceCommand };
