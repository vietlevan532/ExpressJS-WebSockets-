const socketIO = require('socket.io');

function initializeChatSocket(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        
    });
}