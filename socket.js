const { isValidObjectId } = require('mongoose');
const room = require('./model/room.model');

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
    const senderId = data.senderId;
    const roomId = data.roomId;
    const content = data.content;
    console.log(`Message: ${ content }`);
    const time = data.time;
    SendMessageBack(io, data);
}

const SendMessageBack = (io, data) => {
    const room = `room: ${ data.roomId }`;
    console.log(`Room: ${ room }`);
    io.to(room).emit('new_message', data);
}

module.exports = {
    SetSocketName,
    JoinRooms,
    HandleUserSendMessage
}