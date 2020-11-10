const express = require('express');
const roomController = require('../controller/room.controller');

const router = express.Router();

// Get room name
router.post('/getRoomName', roomController.GetRoomName);

// Get member display name
// JSON response keys: _id, displayName
router.post('/memberDisplayName', roomController.GetMemberDisplayName);

module.exports = router;