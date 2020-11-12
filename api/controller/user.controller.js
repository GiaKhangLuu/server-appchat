const User = require('../../model/user.model');

const GetUser = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const user = await User.GetUserById(userId);
    resp.json(user);
}

// Find user by display name to show in search fragment
const SearchUserByDisplayName = async (req, resp) => {
    const displayName = req.body.displayName;
    console.log(`Display name: ${ displayName }`);
    const users = await User.SearchUserByDisplayName(displayName);
    resp.json(users);
}

module.exports = { GetUser, SearchUserByDisplayName };