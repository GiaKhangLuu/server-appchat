const mongoose = require('mongoose');
const moment = require('moment');

const roomSchema = new mongoose.Schema({
    name: String,
    createDate: Date
});

roomSchema.set('toJSON', { virtuals: true });

roomSchema.virtual('formattedCreateDate').get(function () {
    return moment(this.createDate).format('MMMM Do YYYY, h:mm:ss a');
})

const Room = mongoose.model('room', roomSchema, 'room');

const GetRoomName = async roomId => {
    try {
        const room = await Room.findById(roomId);
        return room;
    } catch(err) {
        console.log(err);
        return null;
    }
};

const FindRoomsOfUser = async userId => {
    try {
        const roomIds = await Room.find({ "members": mongoose.Types.ObjectId(userId) }, { _id: 1 }) ;
        return roomIds;
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    Room,
    GetRoomName,
    FindRoomsOfUser
}