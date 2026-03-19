const { getAuth } = require('@clerk/express');
const Mission = require('../models/Mission');

exports.getMissions = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const missions = await Mission.find({ userId }).sort({ deadline: 1 });
    res.json(missions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createMission = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const { title, deadline, startDate } = req.body;
    if (!title || !deadline) {
      return res.status(400).json({ msg: 'Title and Deadline are required' });
    }

    const newMission = new Mission({
      userId,
      title,
      deadline,
      startDate: startDate || Date.now()
    });

    const mission = await newMission.save();
    res.json(mission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteMission = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const mission = await Mission.findOneAndDelete({ _id: req.params.id, userId });

    if (!mission) return res.status(404).json({ msg: 'Mission not found' });
    res.json({ msg: 'Mission removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};