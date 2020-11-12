const express = require('express');
const roomController = require('../controller/room.controller');

const router = express.Router();

// Get member display name
// JSON response keys: _id, displayName
router.post('/memberDisplayName', roomController.GetMemberDisplayName);

// Get single chat 
// JSON response keys: [{ _id }]
router.post('/singleChat', roomController.FindSingleChat);

module.exports = router;