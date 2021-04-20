const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const RoomChat = require('./models/RoomChat.model');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

const PORT = config.get('port') || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/recommend', require('./routes/recommend.routes'));
app.use('/api/order-student', require('./routes/order-student.routes'));
app.use('/api/order-mentor', require('./routes/order-mentor.routes'));
app.use('/api/edit-data', require('./routes/edit-data'));
app.use('/api/add', require('./routes/add-photo.routes'));

io.on('connection', (socket) => {

    console.log('Socket ', socket.id);

    socket.on('USER_JOIN', async (data) => {

        socket.join(data.roomId);

        const room = await RoomChat.findOne({idResponse: data.roomId});

        io.in(data.roomId).emit('GET_MESSAGES', room.messages);

    });

    socket.on('NEW_MESSAGE', async (data) => {

        const {roomId, message} = data;

        await RoomChat.findOneAndUpdate({idResponse: roomId}, {$push: {messages: message }});

        const room = await RoomChat.findOne({idResponse: roomId});

        io.in(data.roomId).emit('SET_MESSAGES', room.messages[room.messages.length - 1]);

    });

});

async function start() {
    try{

        await mongoose.connect(config.get("mongoURI"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        });

        server.listen(PORT, () => console.log(`App has been started on port ${config.get('port')}`));

    }catch (e) {
        console.log('Server error in app block,' + e.message);
        process.exit(1);
    }

};

start();
