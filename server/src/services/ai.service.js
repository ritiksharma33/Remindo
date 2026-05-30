const { GoogleGenAI } = require("@google/genai");

class AIService {

  static getClient(apiKey) {

    return new GoogleGenAI({
      apiKey
    });

  }

  static async generateResponse({
    apiKey,
    model,
    prompt
  }) {

    const ai = this.getClient(apiKey);

    const response =
      await ai.models.generateContent({

        model,
        contents: prompt

      });

    return response.text;
  }

}

module.exports = AIService;