const message = require('./model/message.model');
const Room = require('./model/room.model');
const user = require('./model/user.model');

/* SUPPORT METHODS */

// Get all rooms of user
const FetchRooms = async userId => {
    const rooms = await Room.FindAllRoomsOfUser(userId);
    return rooms;
}

const AddMessage = async data => {
    const senderId = data.senderId;
    const roomId = data.roomId;
    const content = data.content;
    const time = data.time;
    await message.AddMessage(senderId, roomId, content, time);
}

const SendMessageBack = async (io, data) => {
    const room = `room: ${ data.roomId }`;
    //console.log(`Room: ${ room }`);
    const userDisplayName = await user.GetUserDisplayName(data.senderId);
    data.displayName = userDisplayName;
    io.to(room).emit('new_message', data);
    //console.log(data);
}

const NotifyNewMessage = async (io, data) => {
    const roomId = data.roomId;
    const room = `room: ${ roomId }`;
    const msg = await message.FindNewestMessageInRoom(roomId);
    msg.senderId = data.senderId;
    io.to(room).emit('update_conversation', msg);
    SendNotification(io, msg);
}

const SendNotification = async (io, data) => {
    const roomId = data.roomId;
    // Get name of sender in case single chat
    if(data.name === "") {
        data.name = await user.GetUserDisplayName(data.senderId);
    }
    const room = `room: ${ roomId }`;
    io.to(room).emit('show_notification', data);
}

const NotifyNewMultiMembersRoomIsCreated = async (socket, data) => {
    // Update conversation in conversation fragment
    const roomId = data.roomId;
    const room = `room: ${ roomId }`;
    const msg = await message.FindNewestMessageInRoom(roomId);
    socket.to(room).emit('update_conversation', msg);
    // Notify new room is created in other fragments or activities
    msg.senderId = data.senderId;
    if(msg.name === "") {
        msg.name = await msg.GetUserDisplayName(data.senderId);
    }
    socket.to(room).emit('show_notification', msg);
}

const NotifyMemberLeftRoom = async (io, data) => {
    try {
        const userId = data.memberId;
        const roomId = data.roomId;
        const time = data.time;
        const userDisplayName = await user.GetUserDisplayName(userId);
        const notifyMsg = `${ userDisplayName } left the group`;
        // This is noti from server so message obj doesnt have senderId
        const msg = { 
            roomId: roomId,
            content: notifyMsg,
            time: time
        }
        // Add noti message to db
        await AddMessage(msg);
        data.content = notifyMsg;
        // Send noti message for members in group
        SendMessageBack(io, data);
        // Update the conversation of members
        NotifyNewMessage(io, data);
    } catch(err) {
        console.log(err.toString());
    }
}

/* SOCKET METHODS */

// Set socket's name by userId
const SetSocketName = async (socket, idUser) => {
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

const HandleUserSendMessage = async (io, data) => {
    //console.log(`Message: ${ data.content }`);
    try {
        await AddMessage(data);
        SendMessageBack(io, data);
        NotifyNewMessage(io, data);
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
        // Must use ns.connected[id] if use ns.connected.id return undefined
        const socket = ns.connected[id];
        if(members.indexOf(socket.name) >= 0) {
            socket.join(room);
        }
    }
}

const HandleUserLeaveRoom = async (io, socket, data) => {
    const socketRoom = `room: ${ data.roomId }`;
    // Leave socket room
    socket.leave(socketRoom);
    const roomId = data.roomId;
    const searchedRoom = await Room.FindRoomById(roomId);
    // Delete group and all messages in group when members leave all
    if(searchedRoom.members.length == 0) {
        Room.DeleteRoom(roomId);
        message.DeleteMessagesInRoom(roomId);
        return;
    }
    // Add noti message and emit to members in group
    await NotifyMemberLeftRoom(io, data);
}

const NotifyNewRoom = async (socket, data) => {
    await AddMessage(data);
    NotifyNewMultiMembersRoomIsCreated(socket, data);
}

const NotifyTyping = (socket, data) => {
    const room = `room: ${ data.roomId }`;
    socket.to(room).emit('typing', data);
}

const NotifyStopTyping = (socket, data) => {
    const room = `room: ${ data.roomId }`;
    socket.to(room).emit('stop_typing', data);
}

module.exports = {
    SetSocketName,
    JoinRooms,
    HandleUserSendMessage,
    AddUsersToNewRoom,
    HandleUserLeaveRoom,
    NotifyNewRoom,
    NotifyTyping,
    NotifyStopTyping
}