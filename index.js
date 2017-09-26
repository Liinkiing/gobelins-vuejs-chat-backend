let app = require('express')();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Serveur lancé sur le port " + port)
});

let usersCount = 0;

function getConnectedClientsIds() {
    let list = [];
    for (let client in io.sockets.connected) {
        list.push(client);
    }
    return list;
}

io.sockets.on('connection', (socket) => {
    usersCount++;
    console.log(`${socket.conn.remoteAddress} (${socket.id}) s'est connecté (${usersCount} clients)`);

    socket.on('user connected', (user) => {
        socket.user = user;
        socket.user.id = socket.id;
        socket.broadcast.emit('user connected', socket.user);
    });

    socket.on('user disconnected', (user) => {
        socket.broadcast.emit('user disconnected', user);

    });

    socket.on('disconnect', () => {
        usersCount--;
        socket.broadcast.emit('user left');
        console.log(`${socket.id} s'est déconnecté (${usersCount} clients)`);
    });

});
