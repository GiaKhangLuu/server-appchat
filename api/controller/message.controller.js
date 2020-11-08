const Message = require('../../model/message.model');

// Get info rooms by user id
const GetInfoRooms = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const rooms = await Message.GetInfoRoom(userId);
    resp.json(rooms);
}

// Get all conversations of user
const GetConversations = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const lastMessages = await Message.GetAllConversationsOfUser(userId);
    resp.json(lastMessages);
}

// Get all Messages in room
const GetMessages = async (req, resp) => {
    const roomId = req.body.roomId;
    console.log(`RoomId: ${ roomId }`);
    const Messages = await Message.GetAllMessagesInRoom(roomId);
    resp.json(Messages);
}

module.exports = {
    GetInfoRooms,
    GetConversations,
    GetMessages
}