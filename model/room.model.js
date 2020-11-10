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

const FindRoomsOfUser = async userId => {
    try {
        const roomIds = await Room.find({ "members": mongoose.Types.ObjectId(userId) }, { _id: 1 }) ;
        return roomIds;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const GetMemberDisplayName = async (roomId, userId) => {
    try {
        const user = await Room.aggregate([
            // Stage 1: find room by roomId
            { $match: { _id: mongoose.Types.ObjectId(roomId) } },
            // Stage 2: filter user is not user who requests
            { $project: {
                members: { 
                    $filter: { 
                        input: "$members", 
                        as: "member", 
                        cond: { $not: [ 
                            { $eq: ["$$member", mongoose.Types.ObjectId(userId)] } 
                        ] } 
                    } 
                }
            } },
            { $lookup: { from: "user", localField: "members", foreignField: "_id", as: "user" } },
            { $replaceRoot: { newRoot: { $arrayElemAt: ["$user", 0] } } }
        ]);
        return user[0];
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    Room,
    FindRoomsOfUser,
    GetMemberDisplayName
}