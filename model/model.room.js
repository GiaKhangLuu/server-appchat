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

module.exports = {
    Room
}