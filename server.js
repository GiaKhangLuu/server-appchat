const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const userRoute = require('./api/route/user.route');
const roomRoute = require('./api/route/room.route');
const messageRoute = require('./api/route/message.route');
const handleSocket = require('./socket.js');
const { timeLog } = require('console');

const PORT = 3000;

app.use(express.static('client/'));
app.use(bodyParser.json());  // Parsing application/json

mongoose.connect("mongodb://localhost:27017/app-chat", { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/room', roomRoute);
app.use('/api/message', messageRoute);
app.use('/api/user', userRoute);

io.on('connection', socket => {
    // Set up socket
    socket.on('setUpSocket', async userId => {
        handleSocket.SetSocketName(socket, userId);
        console.log(`${ new Date().toLocaleTimeString() }: ${ socket.id } - ${ socket.name } has connected`);
        await handleSocket.JoinRooms(socket, userId);
        //const rooms = io.sockets.adapter.rooms;
        //var count = 0;
        //for(var id in rooms) {
            //if(id.indexOf('room') >= 0) ++count;
        //}
        //console.log(count);
    });

    // Add user to new room
    socket.on('create_new_room', data => {
        handleSocket.AddUsersToNewRoom(io, data);
        //const rooms = io.sockets.adapter.rooms;
        //var count = 0;
        //for(var id in rooms) {
            //if(id.indexOf('room') >= 0) ++count;
        //}
        //console.log(count);
    })

    // Handle user send message
    socket.on('user_send_message', async obj => {
        await handleSocket.HandleUserSendMessage(io, obj);
    });



    // Check disconnected
    socket.on('disconnect', reason => {
        console.log(`${ new Date().toLocaleTimeString() }: ${ socket.id } has disconnected because ${ reason }`);
    });
})

// Test web platform
app.get('/', (req, resp) => {
    resp.sendFile('index.html');
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
})
