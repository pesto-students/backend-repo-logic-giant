// routes/slots.js

const express = require('express');
const router = express.Router();
const slotsController = require('../controller/slotController');




router.post('/set-slots', slotsController.setSlots);
router.get('/get-slots/:userId', slotsController.getSlots);

module.exports = router;
