const roomDetail = require('../../model/roomDetail.model');

// Get info rooms by user id
const GetInfoRooms = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const rooms = await roomDetail.GetInfoRoom(userId);
    resp.json(rooms);
}

// Get all conversations of user
const GetConversations = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const lastMessages = await roomDetail.GetAllConversationsOfUser(userId);
    resp.json(lastMessages);
}

// Get all messages in room
const GetMessages = async (req, resp) => {
    const roomId = req.body.roomId;
    console.log(`RoomId: ${ roomId }`);
    const messages = await roomDetail.GetAllMessagesInRoom(roomId);
    resp.json(messages);
}

module.exports = {
    GetInfoRooms,
    GetConversations,
    GetMessages
}