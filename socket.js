const mongoose = require('mongoose');
const message = require('./model/message.model');
const room = require('./model/room.model');
const user = require('./model/user.model');

/* SUPPORT METHODS */


// Set socket's name by userId
const SetSocketName = async (socket, idUser) => {
    socket.name = idUser;
}

// Get all rooms of user
const FetchRooms = async userId => {
    const rooms = await room.FindAllRoomsOfUser(userId);
    return rooms;
}

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

const UpdateConversation = async (io, data) => {
    const userId = data.senderId;
    const room = `room: ${ data.roomId }`;
    const convers = await message.FindConversationsOfUser(userId);
    const latestConver = convers[0];
    console.log(latestConver);
    io.to(room).emit('update_conversation', latestConver);
}

/* SOCKET METHODS */

// Each socket joins to room by roomId
const JoinRooms = async (socket, userId) => {
    const rooms = await FetchRooms(userId);
    // Join rooms
    rooms.forEach(room => {
        socket.join(`room: ${ room._id }` );
    });
}

// Handle when user send message
const HandleUserSendMessage = async (io, data) => {
    console.log(`Message: ${ data.content }`);
    try {
        await AddMessage(data);
        SendMessageBack(io, data);
        UpdateConversation(io, data);
    } catch(err) {
        console.log(err.toString());
    }
}

const AddUsersToNewRoom = async (io, data) => {
    const members = data.members;
    const room = `room: ${ data.roomId }`;
    // The default namespace is '/'
    ns = io.of('/');
    // api namespace.connected return an obj contains all sockets connected (version 2.*)
    for(var id in ns.connected) {
        // Id is the id of the socket
        const socket = ns.connected[id];
        if(members.indexOf(socket.name) >= 0) {
            socket.join(room);
        }
    }
    //io.to(room).emit('new_room', "New room");
}

module.exports = {
    SetSocketName,
    JoinRooms,
    HandleUserSendMessage,
    AddUsersToNewRoom
}