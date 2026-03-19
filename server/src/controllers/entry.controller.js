const { getAuth } = require('@clerk/express');
const Entry = require('../models/Entry');
// Get all entries for logged-in user
exports.getEntries = async (req, res) => {
  try {
       
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const entries = await Entry.find({ userId }).sort({ date: -1 });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Garden Error: Could not fetch insights');
  }
};

// Create a new entry
exports.createEntry = async (req, res) => {
  try {
    // Use getAuth to safely retrieve the session state
    const { userId } = getAuth(req);

    console.log("LOGGED USER ID:", userId); // This should now show the ID

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newEntry = new Entry({
      userId,
      content: req.body.content,
      image: req.body.image,
      date: new Date()
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error("Error creating entry:", err);
    res.status(500).send('Garden Error: Could not plant seed');
  }
};

// Review entry (SRS)
exports.reviewEntry = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rating } = req.body;

    // ✅ Secure fetch (VERY IMPORTANT)
    let entry = await Entry.findOne({
      _id: req.params.id,
      userId
    });

    if (!entry) {
      return res.status(404).json({ message: "Insight not found" });
    }

    // --- SRS Logic (UNCHANGED) ---
    let newInterval = entry.srs.interval;
    let newStage = entry.srs.stage;
    let newStatus = 'Reviewing';

    if (rating === 'Again') {
      newInterval = 1;
      newStage = 0;
      newStatus = 'Learning';
    } else {
      if (newStage === 0) newInterval = 3;
      else if (newStage === 1) newInterval = 7;
      else if (newStage === 2) newInterval = 21;
      else newInterval = Math.ceil(newInterval * 2.5);
      newStage++;
    }

    if (newInterval > 30) newStatus = 'Mastered';

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    entry.srs = {
      stage: newStage,
      interval: newInterval,
      nextReviewDate: nextDate,
      status: newStatus
    };

    await entry.save();

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Review Error');
  }
};

// Update entry
exports.updateEntry = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Secure update
    let entry = await Entry.findOne({
      _id: req.params.id,
      userId
    });

    if (!entry) {
      return res.status(404).json({ message: "Insight not found" });
    }

    entry.content = req.body.content || entry.content;
    entry.image = req.body.image || entry.image;

    await entry.save();

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Update Error');
  }
};

// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Secure delete
    const entry = await Entry.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!entry) {
      return res.status(404).json({ message: "Insight not found" });
    }

    res.json({ message: "Insight removed from garden" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete Error');
  }
};