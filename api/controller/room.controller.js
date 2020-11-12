const Room = require('../../model/room.model');

const GetMemberDisplayName = async (req, resp) => {
    const roomId = req.body.roomId;
    const userId = req.body.userId;
    const user = await Room.GetMemberDisplayName(roomId, userId);
    resp.json(user);
}

const FindSingleChat  = async (req, resp) => {
    const userId = req.body.userId;
    const searchedUserId = req.body.searchedUserId;
    const roomId = await Room.FindSingleChat(userId, searchedUserId);
    resp.json(roomId);
}

module.exports = {
    GetMemberDisplayName,
    FindSingleChat
}