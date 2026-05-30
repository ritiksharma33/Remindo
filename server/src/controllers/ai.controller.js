const { getAuth } = require("@clerk/express");

const AIService = require("../services/ai.service");

const AISettings =
require("../models/AISettings");

const Memory =
require("../models/Memory");
async function getUserAI(userId) {

  const settings =
  await AISettings.findOne({
    userId
  });

  if (!settings) {

    throw new Error(
      "AI settings not configured"
    );

  }

  return settings;
}
exports.summarizeMemory =
async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const settings =
    await getUserAI(userId);

    const { content } = req.body;

    const summary =
    await AIService.generateResponse({

      apiKey: settings.apiKey,

      model: settings.model,

      prompt:
      `Summarize:\n\n${content}`

    });

    res.json({
      summary
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};
exports.generateFlashcards =
async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const settings =
    await getUserAI(userId);

    const { content } = req.body;

    const flashcards =
    await AIService.generateResponse({

      apiKey: settings.apiKey,

      model: settings.model,

      prompt:
`
Generate 5 flashcards.

Return JSON.

Content:

${content}
`

    });

    res.json({
      flashcards
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};
exports.askAI =
async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const settings =
    await getUserAI(userId);

    const { message } =
    req.body;

    const response =
    await AIService.generateResponse({

      apiKey: settings.apiKey,

      model: settings.model,

      prompt: message

    });

    res.json({
      response
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};
exports.generateTags =
async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const settings =
    await getUserAI(userId);

    const { content } =
    req.body;

    const tags =
    await AIService.generateResponse({

      apiKey: settings.apiKey,

      model: settings.model,

      prompt:
`
Generate tags only.

Content:

${content}
`

    });

    res.json({
      tags
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};
exports.semanticSearch =
async (req, res) => {

  try {

    const { userId } =
    getAuth(req);

    const { query } =
    req.body;

    const results =
    await Memory.find({

      userId,

      $or: [

        {
          title: {
            $regex: query,
            $options: "i"
          }
        },

        {
          content: {
            $regex: query,
            $options: "i"
          }
        }

      ]

    });

    res.json(results);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Search failed"
    });

  }
};