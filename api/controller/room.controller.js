const Room = require('../../model/room.model');

const GetRoomName = async (req, resp) => {
    const roomId = req.body.roomId;
    console.log(`RoomId: ${ roomId }`);
    const room = await Room.GetRoomName(roomId);
    resp.json(room);
}

const GetMemberDisplayName = async (req, resp) => {
    const roomId = req.body.roomId;
    const userId = req.body.userId;
    const user = await Room.GetMemberDisplayName(roomId, userId);
    resp.json(user);
}

module.exports = {
    GetRoomName,
    GetMemberDisplayName
}