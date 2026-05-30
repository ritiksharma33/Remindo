const Memory = require("../models/Memory");
const { getAuth } = require("@clerk/express");

exports.getMemories = async (req, res) => {
  try {
    const userId = "test-user";

    const memories = await Memory.find({
      userId
    }).sort({ createdAt: -1 });

    res.json(memories);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch memories"
    });
  }
};

exports.getMemoryById = async (req, res) => {
  try {

    const userId = "test-user";
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found"
      });
    }

    res.json(memory);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch memory"
    });
  }
};

exports.createMemory = async (req, res) => {

  try {

    const userId = "test-user";

    const memory = await Memory.create({

      userId,

      title: req.body.title,

      content: req.body.content,

      type: req.body.type || "text",

      imageUrl: req.body.imageUrl,

      transcript: req.body.transcript,

      tags: req.body.tags || []

    });

    res.status(201).json(memory);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create memory"
    });

  }
};

exports.updateMemory = async (req, res) => {

  try {

    const userId = "test-user";

    const memory = await Memory.findOneAndUpdate(
      {
        _id: req.params.id,
        userId
      },
      req.body,
      {
        new: true
      }
    );

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found"
      });
    }

    res.json(memory);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update memory"
    });

  }
};

exports.deleteMemory = async (req, res) => {

  try {

    const userId = "test-user";

    const deleted = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Memory not found"
      });
    }

    res.json({
      message: "Memory deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete memory"
    });

  }
};

exports.searchMemories = async (req, res) => {

  try {

    const userId = "test-user";

    const query = req.query.q || "";

    const memories = await Memory.find({
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

    res.json(memories);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Search failed"
    });

  }
};