const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./api/route/user.route');
const roomRoute = require('./api/route/room.route');
const roomDetailRoute = require('./api/route/roomDetail.route');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Parsing application/json

mongoose.connect("mongodb://localhost:27017/app-chat", { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/room', roomRoute);
app.use('/api/roomDetail', roomDetailRoute);
app.use('/api/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
})
