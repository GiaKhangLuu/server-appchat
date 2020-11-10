const Message = require('../../model/message.model');

// Get info rooms by user id
const GetInfoRooms = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const rooms = await Message.GetInfoRoom(userId);
    resp.json(rooms);
}

// Get all conversations of user
const FindConversationsOfUser = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const conversations = await Message.FindConversationsOfUser(userId);
    resp.json(conversations);
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
    FindConversationsOfUser,
    GetMessages
}