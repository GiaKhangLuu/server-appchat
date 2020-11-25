const mongoose = require('mongoose');
const message = require('./model/message.model');
const room = require('./model/room.model');
const user = require('./model/user.model');

// Support method
const SendMessageBack = async (io, data) => {
    const room = `room: ${ data.roomId }`;
    console.log(`Room: ${ room }`);
    const userDisplayName = await user.GetUserDisplayName(data.senderId);
    data.displayName = userDisplayName;
    io.to(room).emit('new_message', data);
    console.log(data);
}

const AddMessage = async data => {
    const senderId = data.senderId;
    const roomId = data.roomId;
    const content = data.content;
    const time = data.time;
    await message.AddMessage(senderId, roomId, content, time);
}


// Socket method

// Set socket's name by userId
const SetSocketName = (socket, idUser) => {
    socket.name = idUser;
}

// Each socket joins to room by roomId
const JoinRooms = async (socket, userId) => {
    const rooms = await FetchRooms(userId);
    // Join rooms
    rooms.forEach(room => {
        socket.join(`room: ${ room._id }` );
    });
}

// Get all rooms of user
const FetchRooms = async userId => {
    const rooms = await room.FindAllRoomsOfUser(userId);
    return rooms;
}

// Handle when user send message
const HandleUserSendMessage = async (io, data) => {
    console.log(`Message: ${ data.content }`);
    AddMessage(data);
    SendMessageBack(io, data);
}

module.exports = {
    SetSocketName,
    JoinRooms,
    HandleUserSendMessage
}