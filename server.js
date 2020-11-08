const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const userRoute = require('./api/route/user.route');
const roomRoute = require('./api/route/room.route');
const messageRoute = require('./api/route/message.route');

const PORT = 3000;

app.use(express.static('client/'));
app.use(bodyParser.json());  // Parsing application/json

mongoose.connect("mongodb://localhost:27017/app-chat", { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/room', roomRoute);
app.use('/api/message', messageRoute);
app.use('/api/user', userRoute);

io.on('connection', socket => {
    //socket.name = "5f83147bd27b95f9d16bc3eb";
    console.log(`${ new Date().toLocaleTimeString() }: ${ socket.id } has connected`);
    //socket.join('5f83189cd27b95f9d16bc3f0');
    //console.log(socket.rooms);

    socket.on('disconnect', reason => {
        console.log(`${ new Date().toLocaleTimeString() }: ${ socket.id } has disconnected because ${ reason }`);
    })
})

// Test web platform
app.get('/', (req, resp) => {
    resp.sendFile('index.html');
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
})
