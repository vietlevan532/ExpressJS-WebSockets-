const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./config/mongoose');
const route = require('./routers');
const app = express();
const http = require('http').Server(app);
const handlebarsHelpers = require('./config/helpers');
const io = require('socket.io')(http);

const User = require('./models/User');
const Conversation = require('./models/Conversation');

// Database connection
db.connect();

// Dot ENV
require('dotenv').config();

// Body parser
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Handlebars helpers registration
handlebars.create({
    helpers: handlebarsHelpers.registerHelpers()
});

// Router
route(app)

// Socket.io
const userNameSpace = io.of('/user-namespace');

userNameSpace.on('connection', async function(socket) {
    console.log('A user connected');
    const userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id: userId }, { $set: {status: true} });
    // User broadcast online status
    socket.broadcast.emit('getOnlineUser', { user_id: userId });
    console.log(socket.broadcast.emit('getOnlineUser', { user_id: userId }));

    
    // Disconnect
    socket.on('disconnect', async function() {
        console.log('User disconnected');
        const userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({ _id: userId }, { $set: {status: false} });
        // User broadcast offline status
        socket.broadcast.emit('getOfflineUser', { user_id: userId });
        console.log(socket.broadcast.emit('getOfflineUser', { user_id: userId }));
    });

    // Conversation implement
    socket.on('newMessage', function(data) {
        socket.broadcast.emit('loadNewMessage', data);
    });

    // Load old conversations data
    socket.on('existConversation', async function(data) {
        const conversations = await Conversation.find({ $or:[
            { sender: data.sender, receiver: data.receiver },
            { sender: data.receiver, receiver: data.sender }
        ]});
        const receiver = await User.findById(data.receiver);
        socket.emit('loadConversations', {conversations: conversations, receiver: receiver});
    });

    // Delete messages 
    socket.on('messageDeleted', function(id) {
        socket.broadcast.emit('chatMessageDeleted', id);
    });

    // Update messages
    socket.on('messageUpdated', function(data) {
        socket.broadcast.emit('chatMessageUpdated', data);
    });
});

http.listen(process.env.PORT, () => console.log(`Chat app listening on server http://localhost:${process.env.PORT}`));
