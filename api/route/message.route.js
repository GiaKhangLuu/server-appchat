const express = require('express');
const messageController = require('../controller/message.controller');

const router = express.Router();

// Get info rooms by user id
router.post('/getInfoRooms', messageController.GetInfoRooms);

// Get all conversations of user 
// JSON response fields: roomId, name, content, time
router.post('/conversations', messageController.FindConversationsOfUser);

// Get all messages in room
router.post('/getMessagesInRoom', messageController.GetMessages);

module.exports = router;