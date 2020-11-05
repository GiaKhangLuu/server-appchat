const Room = require('../../model/room.model');

const GetRoomName = async (req, resp) => {
    const roomId = req.body.roomId;
    console.log(`RoomId: ${ roomId }`);
    const room = await Room.GetRoomName(roomId);
    resp.json(room);
}

module.exports = {
    GetRoomName
}