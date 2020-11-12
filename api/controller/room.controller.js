const Room = require('../../model/room.model');

// Get display name of your friend to set title of action bar
const GetMemberDisplayNameInSingleChat = async (req, resp) => {
    const roomId = req.body.roomId;
    const userId = req.body.userId;
    const user = await Room.GetMemberDisplayNameInSingleChat(roomId, userId);
    resp.json(user);
}

// Find single chat group of two user 
const FindSingleChat  = async (req, resp) => {
    const userId = req.body.userId;
    const searchedUserId = req.body.searchedUserId;
    const roomId = await Room.FindSingleChat(userId, searchedUserId);
    resp.json(roomId);
}

// Find rooms of user to show in group fragment
const FindRoomsOfUser = async (req, resp) => {
    const userId = req.body.userId;
    //const rooms = await Room.FindRoomsOfUser(userId);
    resp.json(rooms);
}

module.exports = {
    GetMemberDisplayNameInSingleChat,
    FindSingleChat,
    FindRoomsOfUser
}