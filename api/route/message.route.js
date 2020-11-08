const express = require('express');
const messageController = require('../controller/message.controller');

const router = express.Router();

// Get info rooms by user id
router.post('/getInfoRooms', messageController.GetInfoRooms);

// Get all last messages of user
router.post('/getConversations', messageController.GetConversations);

// Get all messages in room
router.post('/getMessagesInRoom', messageController.GetMessages);

module.exports = router;