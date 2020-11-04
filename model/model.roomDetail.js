const mongoose = require('mongoose');
const moment = require('moment');

const roomDetailSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    roomId: mongoose.Types.ObjectId,
    message: String,
    time: Date
});

roomDetailSchema.set('toJSON', { virtuals: true });

roomDetailSchema.virtual('formattedTime').get(function() {
    return moment(this.time).format('MMMM Do YYYY, h:mm:ss a');
})

const RoomDetail = mongoose.model('roomDetail', roomDetailSchema, 'roomDetail');

const GetRoomIdsByUserId = async userId => {
    try {
        const rooms = await RoomDetail.distinct("roomId", { userId: userId } );
        return rooms;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const GetAllConversationsOfUser = async userId => {
    try {
        const roomIds = await GetRoomIdsByUserId(userId);
        // Put all roomId in array to to filter
        const arrExp = [];
        for(const roomId of roomIds) {
            const obj =  { roomId: mongoose.Types.ObjectId(roomId) } ;
            arrExp.push(obj);
        }
        const conversations = await RoomDetail.aggregate([
            // Stage 1 - get all roomDetails by roomId
            { $match: { $or: arrExp } },
            // Stage 2 - find last message time
            { 
                $group: {
                    _id: "$roomId", 
                    lastMessageTime: { $max: "$time" }, 
                    messages: { $push: { message: "$message", time: "$time" } } 
                } 
            },
            // Stage 3 - find room name by roomId
            { 
                $lookup: {
                    from: "room", localField: "_id", foreignField: "_id", as: "room"
                }
            },
            // Stage 4 - get last message and message time
            { 
                $project: { 
                    room: 1, 
                    messages: {
                        $filter: {
                            input: "$messages",
                            as: "mess",
                            cond: { $eq: ["$$mess.time", "$lastMessageTime"] }
                        }
                    }
                }
            },
            // Stage 5 - clean data
            { 
                $replaceRoot: { 
                    newRoot: { 
                        $mergeObjects: [{ $arrayElemAt: ["$room", 0] }, { $arrayElemAt: ["$messages", 0] }] 
                    } 
                } 
            },
            // Stage 6 - sort by time
            { $sort: { time: -1 } }
        ]);
        FormatData(conversations);
        return conversations;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const FormatData = arr => {
    for(const item of arr) {
        item.time =  moment(item.time).format('MMMM Do, hh:mm:ss a');
    }
}

const GetAllMessagesInRoom = async roomId => {
    try {
        const messages = await RoomDetail.aggregate([
            // Stage 1 - get all records in room by group roomId
            { $match: { roomId: mongoose.Types.ObjectId(roomId) } },
            // Stage 2 - find user by userId in stage 1
            { $lookup: { from: "user", localField: "userId", foreignField: "_id", as: "user" } },
            // Stage 3 - reshape documents
            { 
                $replaceRoot: { 
                    newRoot: { 
                        $mergeObjects: [ { $arrayElemAt: ["$user", 0] }, "$$ROOT"] 
                    } 
                } 
            },
            // Stage 4 - clean data
            { $project: { displayName: 1, message: 1, time: 1, roomId: 1 } },
            // Stage 5 - sort by time
            { $sort: { time: 1 } }
        ]);
        return messages;
    } catch(err) {
        console.log(err);
        return null;
    }
}

const GetInfoRoom = async userId => {
    try {
        const rooms = RoomDetail.aggregate([
            // Stage 1 - Find all rooms of user
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            // Stage 2 - Group room
            { $group: { _id: "$roomId" } },
            // Stage 3 - find room info by roomId
            { $lookup: { from: "room", localField: "_id", foreignField: "_id", as: "room" } },
            // Stage 4 - clean data
            { $replaceRoot: { newRoot: { $arrayElemAt: ["$room", 0] } } }
        ]);
        return rooms;
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = { 
    RoomDetail,
    GetAllConversationsOfUser,
    GetAllMessagesInRoom,
    GetInfoRoom
}