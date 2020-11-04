const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User, GetUserById } = require('./model/model.user');
const { Room } = require('./model/model.room');
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

// Get all last messages of user
app.post('/getLastMessages', async (req, resp) => {
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

app.get('/user', async (req, resp) => {
    const users = await User.find();
    resp.json(users);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
})
