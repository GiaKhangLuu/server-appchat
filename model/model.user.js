const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: String
});

const User = new mongoose.model('user', userSchema, 'user');

const GetUserById = async userId => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    User,
    GetUserById
}