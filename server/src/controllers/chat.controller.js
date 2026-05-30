const { getAuth } = require("@clerk/express");

const Chat = require("../models/Chat");

exports.getChats = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const chats =
      await Chat.find({
        userId
      })
      .sort({ updatedAt: -1 });

    res.json(chats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch chats"
    });

  }
};

exports.getChatById = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const chat =
      await Chat.findOne({
        _id: req.params.id,
        userId
      });

    if (!chat) {

      return res.status(404).json({
        message: "Chat not found"
      });

    }

    res.json(chat);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch chat"
    });

  }
};

exports.createChat = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const chat =
      await Chat.create({

        userId,

        title:
          req.body.title ||
          "New Chat",

        messages:
          req.body.messages || []

      });

    res.status(201).json(chat);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create chat"
    });

  }
};

exports.deleteChat = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const deleted =
      await Chat.findOneAndDelete({

        _id: req.params.id,

        userId

      });

    if (!deleted) {

      return res.status(404).json({
        message: "Chat not found"
      });

    }

    res.json({
      message: "Chat deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete chat"
    });

  }
};