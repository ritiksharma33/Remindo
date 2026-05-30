const { getAuth } = require("@clerk/express");

const Mission = require("../models/Mission");
const Memory = require("../models/Memory");

exports.getMissions = async (req, res) => {
  try {

    const { userId } = getAuth(req);

    const missions = await Mission.find({
      userId
    })
    .populate("linkedMemories")
    .sort({ deadline: 1 });

    res.json(missions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch missions"
    });

  }
};

exports.getMissionById = async (req, res) => {
  try {

    const { userId } = getAuth(req);

    const mission = await Mission.findOne({
      _id: req.params.id,
      userId
    }).populate("linkedMemories");

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found"
      });
    }

    res.json(mission);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch mission"
    });

  }
};

exports.createMission = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const mission = await Mission.create({

      userId,

      title: req.body.title,

      description: req.body.description,

      deadline: req.body.deadline,

      startDate:
        req.body.startDate || Date.now()

    });

    res.status(201).json(mission);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create mission"
    });

  }
};

exports.updateMission = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const mission =
      await Mission.findOneAndUpdate(
        {
          _id: req.params.id,
          userId
        },
        req.body,
        {
          new: true
        }
      );

    if (!mission) {

      return res.status(404).json({
        message: "Mission not found"
      });

    }

    res.json(mission);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update mission"
    });

  }
};

exports.deleteMission = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const deleted =
      await Mission.findOneAndDelete({
        _id: req.params.id,
        userId
      });

    if (!deleted) {

      return res.status(404).json({
        message: "Mission not found"
      });

    }

    res.json({
      message: "Mission deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete mission"
    });

  }
};

exports.linkMemory = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const { memoryId } = req.body;

    const mission =
      await Mission.findOne({
        _id: req.params.id,
        userId
      });

    if (!mission) {

      return res.status(404).json({
        message: "Mission not found"
      });

    }

    const memory =
      await Memory.findOne({
        _id: memoryId,
        userId
      });

    if (!memory) {

      return res.status(404).json({
        message: "Memory not found"
      });

    }

    if (
      !mission.linkedMemories.includes(memoryId)
    ) {
      mission.linkedMemories.push(memoryId);
    }

    await mission.save();

    res.json(mission);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to link memory"
    });

  }
};