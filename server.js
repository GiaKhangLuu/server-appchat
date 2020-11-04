const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { 
    User, 
    GetUserById,
    SearchUserByDisplayName 
} = require('./model/model.user');
const { 
    Room, 
    GetRoomName 
} = require('./model/model.room');
const { 
    RoomDetail, 
    GetAllConversationsOfUser,
    GetAllMessagesInRoom,
    GetInfoRoom
} = require('./model/model.roomDetail');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Parsing application/json
mongoose.connect("mongodb://localhost:27017/app-chat", { useNewUrlParser: true, useUnifiedTopology: true });

// Get info rooms by user id
app.post('/getInfoRooms', async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const rooms = await GetInfoRoom(userId);
    resp.json(rooms);
})

// Get room name
app.post('/getRoomName', async (req, resp) => {
    const roomId = req.body.roomId;
    console.log(`RoomId: ${ roomId }`);
    const room = await GetRoomName(roomId);
    resp.json(room);
})

// Get all last messages of user
app.post('/getConversations', async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const lastMessages = await GetAllConversationsOfUser(userId);
    resp.json(lastMessages);
})

// Get all messages in room
app.post('/getMessagesInRoom', async (req, resp) => {
    const roomId = req.body.roomId;
    console.log(`RoomId: ${ roomId }`);
    const messages = await GetAllMessagesInRoom(roomId);
    resp.json(messages);
})

// Find user by id
app.post('/getUser', async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const user = await GetUserById(userId);
    resp.json(user);
})

// Search users by displayName
app.post('/searchUser', async (req, resp) => {
    const displayName = req.body.displayName;
    console.log(`Display name: ${ displayName }`);
    const users = await SearchUserByDisplayName(displayName);
    resp.json(users);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
})
