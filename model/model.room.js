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
        const roomName = await Room.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(roomId) } },
            { $project: { name: 1, _id: 0 } }
        ])
        // Aggregate return array
        return roomName[0];
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    Room,
    GetRoomName
}