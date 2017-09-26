let app = require('express')();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Serveur lancé sur le port " + port)
});

let usersCount = 0;
let clients = [];

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

    console.log(clients);

    socket.on('user connected', (user) => {
        socket.user = user;
        socket.user.id = socket.id;
        clients.push(socket.user);
        console.log(socket.id + "vient de se co");
        socket.emit('user connected', socket.user);
        socket.broadcast.emit("user joined", clients);
    });

    socket.on('user disconnected', (user) => {
        usersCount--;
        socket.broadcast.emit('user disconnected', user);
        clients = clients.filter(c => c.id !== user.id);
    });

    socket.on('disconnect', () => {
        usersCount--;
        clients = clients.filter(c => c.id !== socket.id);
        socket.broadcast.emit('user left', socket.id);
        console.log(`${socket.id} s'est déconnecté (${usersCount} clients)`);
    });


});
