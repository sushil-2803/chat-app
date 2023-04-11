const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));


io.on('connection',(socket)=>{
    console.log('New WebSocket connection')
    socket.emit('message',"Welcome!")
    // on is used to listen to a event
    socket.on('sendMessage',(message)=>{
        console.log(message)
        //io sends message to all connceted to socket
        //emit is used to send a message
        io.emit('message',message)
    })
})


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});