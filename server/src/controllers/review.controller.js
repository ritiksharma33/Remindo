const { getAuth } = require("@clerk/express");

const Memory = require("../models/Memory");
const Review = require("../models/Review");

const SRSService = require("../services/srs.service");

exports.getTodayReviews = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const today = new Date();

    const reviews = await Memory.find({

      userId,

      "srs.nextReviewDate": {
        $lte: today
      }

    });

    res.json(reviews);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reviews"
    });

  }
};

exports.submitReview = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const { rating } = req.body;

    const memory = await Memory.findOne({

      _id: req.params.memoryId,
      userId

    });

    if (!memory) {

      return res.status(404).json({
        message: "Memory not found"
      });

    }

    const nextSRS =
      SRSService.calculateNextReview(
        memory.srs,
        rating
      );

    memory.srs = nextSRS;

    await memory.save();

    await Review.create({

      userId,

      memoryId: memory._id,

      rating

    });

    res.json(memory);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Review failed"
    });

  }
};

exports.getReviewStats = async (req, res) => {

  try {

    const { userId } = getAuth(req);

    const totalReviews =
      await Review.countDocuments({
        userId
      });

    const mastered =
      await Memory.countDocuments({

        userId,

        "srs.status": "Mastered"

      });

    res.json({

      totalReviews,

      mastered

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch stats"
    });

  }
};