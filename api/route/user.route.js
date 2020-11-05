const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

// Find user by id
router.post('/getUser', userController.GetUser);

// Search users by displayName
router.post('/searchUser', userController.SearchUserByDisplayName);

module.exports = router;