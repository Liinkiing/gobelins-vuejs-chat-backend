class Message {

    constructor(body, author, isBot = false) {
        this.body = body;
        this.createdAt = Date.now();
        this.author = author;
        this.isBot = isBot;
    }

}

function randomColor() {
    let colors = ["red", "rose", "light_green", "violet", "orange", "pale_red", "cyan", "dark_green",
        "pale_green", "pale_yellow", "yellow", "blue"];
    return colors[Math.floor(Math.random()*colors.length)];
}

let app = require('express')();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Serveur lancé sur le port " + port)
});

let clients = [];

io.sockets.on('connection', (socket) => {
    console.log(`${socket.conn.remoteAddress} (${socket.id}) s'est connecté au socket`);

    socket.emit('getUsers', clients);

    socket.on('user connected', (user) => {
        socket.user = user;
        socket.user.id = socket.id;
        socket.user.color = randomColor();
        console.log(socket.user);
        if(clients.filter(u => u.id === socket.id).length === 0) clients.push(socket.user);
        console.log(socket.id + "vient de se co au chat mais est déjà co au socket");
        socket.emit('user connected', socket.user);
        socket.broadcast.emit("user joined", {clients, new: socket.user});
    });

    socket.on('new message', (body) => {
        console.log(socket.id + " a envoyé un message");
        let message = new Message(body, socket.user);
        console.log(message);
        io.sockets.emit("new message", message);
    });

    socket.on('command', (command) => {
        let data = {};
        switch (command) {
            case "/johncena":
                data.command = "PLAY_AUDIO";
                data.payload = "johncena";
                socket.emit('command issued', data);
                socket.broadcast.emit('command issued', data);
                break;
            case "/ah":
                data.command = "PLAY_AUDIO";
                data.payload = "ah";
                socket.emit('command issued', data);
                socket.broadcast.emit('command issued', data);
                break;
        }
    });

    socket.on('user disconnected', (user) => {
        socket.broadcast.emit('user disconnected', user);
        socket.broadcast.emit('user left', socket.id);
        console.log(`${socket.id} s'est déconnecté du chat mais pas du socket`);
        clients = clients.filter(c => c.id !== user.id);
    });

    socket.on('wizz', () => {
        console.log(socket.user, "a envoyé un wizz");
        socket.broadcast.emit('wizz', socket.user);
    });

    socket.on('disconnect', () => {
        clients = clients.filter(c => c.id !== socket.id);
        socket.broadcast.emit('user left', socket.id);
        console.log(`${socket.id} s'est déconnecté`);
    });


});
