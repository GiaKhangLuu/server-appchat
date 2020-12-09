const User = require('../../model/user.model');

const GetUser = async (req, resp) => {
    const userId = req.body.userId;
    console.log(`UserId: ${ userId }`);
    const user = await User.GetUserById(userId);
    resp.json(user);
}

// Login
const Login = async (req, resp) => {
    const accountName = req.body.accountName;
    const password = req.body.password;
    const user = await User.Login(accountName, password);
    resp.json(user);
}

// Find user by display name to show in search fragment
const SearchUserByDisplayName = async (req, resp) => {
    const displayName = req.body.displayName;
    console.log(`Display name: ${ displayName }`);
    const users = await User.SearchUserByDisplayName(displayName);
    resp.json(users);
}

// Add new user
const InsertUser = async (req, resp) => {
    const accountName = req.body.accountName;
    const password = req.body.password;
    const displayName = req.body.displayName;
    const phoneNumber = req.body.phoneNumber;
    const user = await User.InsertUser(accountName, password, displayName, phoneNumber);
    console.log(user);
    resp.json(user);
}

const FindUserByAccountName = async (req, resp) => {
    const accountName = req.body.accountName;
    const users = await User.FindUserByAccountName(accountName);
    resp.json(users);
}

module.exports = { 
    GetUser, 
    SearchUserByDisplayName, 
    Login,
    InsertUser,
    FindUserByAccountName
};