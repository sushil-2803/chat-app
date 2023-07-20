const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage}=require('./utils/messages')
const app = express()
// creating a server and passing express app
const server = http.createServer(app)
// creating io by passing http server
const io = socketio(server)
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
// public dir for static files
app.use(express.static(publicDirectoryPath));

// connection runs when a new client joins
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    //socket only sends message to the client
    //emit is used to emit a event
    socket.emit('message', generateMessage("Welcome!"))
    //sends a broadcast message to all connected client expect the creater
    socket.broadcast.emit('message', generateMessage("A new user has joined!"))
    // on is used to listen to a event
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        //io sends message to all connceted to socket
        //emit is used to send a message
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        socket.broadcast.emit('locationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
        // callback is used to send ack that the event is run succefully
        // callback can take no or multiple parameter which is passed to
        // the client making the request
        callback()
    })

    // send message to all users when a client disconnects
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});