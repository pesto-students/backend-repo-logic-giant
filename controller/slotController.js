// controllers/slotsController.js

const Slot = require('../models/slots');

// Set available slots
exports.setSlots = async (req, res) => {
  try {
    const {  slots } = req.body;

    // Validate that all slots have both startTime and endTime
    const isValidSlots = slots.every((slot) => slot.startTime && slot.endTime);

    if (!isValidSlots) {
      return res.status(400).json({ message: 'Invalid slots data' });
    }

    // Create and save the slots in the database
    const savedSlots = await Slot.create(slots.map((slot) => ({  ...slot })));

    res.status(201).json({ message: 'Slots set successfully', slots: savedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to set slots' });
  }
};

// Get available slots for a user
exports.getSlots = async (req, res) => {
  try {
    // const userId = req.params.userId;

    // Find slots associated with the user in the database
    const slots = await Slot.find({ userId });

    res.status(200).json({ slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get slots' });
  }
};
