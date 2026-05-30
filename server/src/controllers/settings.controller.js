const { getAuth } = require("@clerk/express");
const AISettings = require("../models/AISettings");

exports.getAISettings = async (req, res) => {
  try {
    const userId = "test-user";

    let settings = await AISettings.findOne({ userId });

    if (!settings) {
      settings = await AISettings.create({
        userId,
        provider: "gemini",
        model: "gemini-2.5-flash"
      });
    }

    res.json(settings);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch settings"
    });
  }
};

exports.updateAISettings = async (req, res) => {
  try {
    const userId = "test-user";

    const settings = await AISettings.findOneAndUpdate(
      { userId },
      {
        provider: req.body.provider,
        model: req.body.model,
        apiKey: req.body.apiKey
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json(settings);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save settings"
    });
  }
};