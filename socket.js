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
    const roomId = data.roomId;
    const room = `room: ${ roomId }`;
    const msg = await message.FindNewestMessageInRoom(roomId);
    console.log(msg);
    io.to(room).emit('update_conversation', msg);
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
        UpdateConversation(io, data);
    } catch(err) {
        console.log(err.toString());
    }
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
    const searchedRoom = await room.FindRoomById(roomId);
    // Delete group and all messages in group when members leave all
    if(searchedRoom.members.length == 0) {
        room.DeleteRoom(roomId);
        message.DeleteMessagesInRoom(roomId);
        return;
    }
    // Add noti message and emit to members in group
    await NotifyMemberLeftRoom(io, data);
}



module.exports = {
    SetSocketName,
    JoinRooms,
    HandleUserSendMessage,
    AddUsersToNewRoom,
    HandleUserLeaveRoom
}