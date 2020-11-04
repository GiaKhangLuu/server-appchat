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
        return null;
    }
}

const SearchUserByDisplayName = async displayName => {
    try {
        const regex = new RegExp(`^${ displayName }`);
        const users = await User.find({ displayName: { $regex: regex } });
        return users;
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    User,
    GetUserById,
    SearchUserByDisplayName
}