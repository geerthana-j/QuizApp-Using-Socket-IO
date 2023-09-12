const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const cors= require('cors');
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:["GET", "HEAD"],
    },
});

const availableRooms = [{ name: "XYZ123", player1: null, player2: null }];
let room;

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Log the current UTC time when a socket connects
    console.log('Time: ' + new Date().toUTCString());

    // Handle the 'addRoom' event from clients
    io.emit('availableRoom', {availableRooms});
    socket.on('join',(obj)=>{
        socket.join(obj.name);
       
    });
    socket.emit('room',)
    socket.on('addRoom', (added) => {
        console.log(added);
        // Add the new room to the availableRooms array
        availableRooms.push(added);
        // Emit the updated list of available rooms to all connected clients
        io.emit('availableRoom', { obj: availableRooms });
    });
});
// console.log('hi');
// // Log the initial list of available rooms
// console.log(availableRooms);
// io.emit('availableRoom', { obj: availableRooms });

// Emit the initial list of available rooms to all connected clients

// Define the port to listen on
const port = process.env.PORT || 8885;

// Start the server
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});





