const mongoose = require('mongoose');
const moment = require('moment');

mongoose.set('useFindAndModify', false);

const roomSchema = new mongoose.Schema({
    name: String,
    createDate: Date,
    members: Array
});

roomSchema.set('toJSON', { virtuals: true });

roomSchema.virtual('formattedCreateDate').get(function () {
    return moment(this.createDate).format('MMMM Do YYYY, h:mm:ss a');
})

const Room = mongoose.model('room', roomSchema, 'room');

const FindAllRoomsOfUser = async userId => {
    try {
        const roomIds = await Room.find({ "members": mongoose.Types.ObjectId(userId) }, { _id: 1 }) ;
        return roomIds;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const GetMemberDisplayNameInSingleChat = async (roomId, userId) => {
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

const FindSingleChat = async (userId, searchedUserId) => {
    if(userId === searchedUserId) {
        return [];
    }
    try {
        const roomId = await Room.aggregate([
            { $match: { $and: [
                { members: mongoose.Types.ObjectId(userId) }, 
                { members: mongoose.Types.ObjectId(searchedUserId)},
                { members: { $size: 2 } }
            ] } },
            { $project: { _id: 1 } }
        ])
        return roomId;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const FindMultiMembersRooms = async userId => {
    try {
        const rooms = Room.aggregate([
            { $match: { 
                $and: [
                       { members: mongoose.Types.ObjectId(userId) },
                       { members: { $not: { $size: 2 } } } 
                ] } 
            },
            { $project: { name: 1, createDate: 1 } }
        ]);
        return rooms;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const RemoveUserFromRoom = async (userId, roomId) => {
    try {
        const rs = await Room.findByIdAndUpdate(roomId, 
            { $pull: { members: mongoose.Types.ObjectId(userId) } },
            { new: true })
        //const rs = await Room.find({ "members": mongoose.Types.ObjectId(userId) });
        return rs;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const CreateRoom = async (name, members) => {
    var room = new Room();
    room.name = name;
    room.members = members;
    room.createDate = new Date();
    await Room.create(room);
    return room._id;
}

module.exports = {
    FindAllRoomsOfUser,
    GetMemberDisplayNameInSingleChat,
    FindSingleChat,
    FindMultiMembersRooms,
    RemoveUserFromRoom,
    CreateRoom
}