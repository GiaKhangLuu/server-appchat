const Room = require('../../model/room.model');

const GetMemberDisplayName = async (req, resp) => {
    const roomId = req.body.roomId;
    const userId = req.body.userId;
    const user = await Room.GetMemberDisplayName(roomId, userId);
    resp.json(user);
}

module.exports = {
    GetMemberDisplayName
}