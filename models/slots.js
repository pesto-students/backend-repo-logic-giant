// models/Slot.js

const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to the User model
  //   required: true,
  // },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
