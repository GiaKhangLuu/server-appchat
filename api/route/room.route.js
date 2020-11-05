const express = require('express');
const roomController = require('../controller/room.controller');

const router = express.Router();

// Get room name
router.post('/getRoomName', roomController.GetRoomName);

module.exports = router;