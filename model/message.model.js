const mongoose = require('mongoose');
const moment = require('moment');
const Room = require('./room.model');

const messageSchema = new mongoose.Schema({
    senderId: mongoose.Types.ObjectId,
    roomId: mongoose.Types.ObjectId,
    content: String,
    time: Date
});

messageSchema.set('toJSON', { virtuals: true });

messageSchema.virtual('formattedTime').get(function() {
    return moment(this.time).format('MMMM Do YYYY, h:mm:ss a');
})

const Message = mongoose.model('message', messageSchema, 'message');

const FindConversationsOfUser = async userId => {
    try {
        // Get all rooms of user
        const roomIds = await Room.FindAllRoomsOfUser(userId);
        // Put all roomId in array to filter
        const arrExp = [];
        for(const roomId of roomIds) {
            const _id = roomId._id.toString();
            const expression =  { roomId: mongoose.Types.ObjectId(_id) } ;
            arrExp.push(expression);
        }
        const conversations = await Message.aggregate([
            // Stage 1 - get all roomDetails by roomId
            { $match: { $or: arrExp } },
            // Stage 2 - find last message time
            { 
                $group: {
                    _id: "$roomId", 
                    lastMessageTime: { $max: "$time" }, 
                    contents: { $push: { content: "$content", time: "$time" } } 
                } 
            },
            // Stage 3 - find room name by roomId
            { 
                $lookup: {
                    from: "room", localField: "_id", foreignField: "_id", as: "roomInfo"
                }
            },
            // Stage 4 - get last message and message time
            { 
                $project: { 
                    "roomInfo.name": 1, 
                    contents: {
                        $filter: {
                            input: "$contents",
                            as: "content",
                            cond: { $eq: ["$$content.time", "$lastMessageTime"] }
                        }
                    }
                }
            },
            // Stage 5 - clean data
            { 
                $replaceRoot: { 
                    newRoot: { 
                        $mergeObjects: [{ roomId: "$_id" }, { $arrayElemAt: ["$roomInfo", 0] }, { $arrayElemAt: ["$contents", 0] }] 
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

const GetMessagesInRoom = async roomId => {
    try {
        const messages = await Message.aggregate([
            // Stage 1 - get all records in room by group roomId
            { $match: { roomId: mongoose.Types.ObjectId(roomId) } },
            // Stage 2 - find sender by senderId in stage 1
            { $lookup: { from: "user", localField: "senderId", foreignField: "_id", as: "user" } },
            // Stage 3 - reshape documents
            { 
                $replaceRoot: { 
                    newRoot: { 
                        $mergeObjects: [ { $arrayElemAt: ["$user", 0] }, "$$ROOT"] 
                    } 
                } 
            },
            // Stage 4 - clean data
            { $project: { displayName: 1, content: 1, time: 1, senderId: 1, _id: 0 } },
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
        const rooms = Message.aggregate([
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
    Message,
    FindConversationsOfUser,
    GetMessagesInRoom,
    GetInfoRoom
}