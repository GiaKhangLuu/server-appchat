const express = require('express');
const roomDetailController = require('../controller/roomDetail.controller');

const router = express.Router();

// Get info rooms by user id
router.post('/getInfoRooms', roomDetailController.GetInfoRooms);

// Get all last messages of user
router.post('/getConversations', roomDetailController.GetConversations);

// Get all messages in room
router.post('/getMessagesInRoom', roomDetailController.GetMessages);

module.exports = router;