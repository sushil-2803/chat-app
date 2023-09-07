const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage,generateImageMessage } = require('./utils/messages');
const { addUser, removeUser, getUsersInRoom, getUser } = require('./utils/users');
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
    // on is used to listen to a event
    socket.on("join", ({ username, room },callback) => {
        const{error,user}=addUser({id:socket.id,username,room})
        
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        //io.to.emit: - emits message to specific room
        //socket.brodcast.to.emit
        //socket only sends message to the client
        //emit is used to emit a event
        socket.emit('message', generateMessage("admin","Welcome!"))
        //sends a broadcast message to all connected client expect the creater
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()

    })

    socket.on('sendMessage', (message, callback) => {
        const user=getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        //io sends message to all connceted to socket
        //emit is used to send a message
        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        // callback is used to send ack that the event is run succefully
        // callback can take no or multiple parameter which is passed to
        // the client making the request
        callback()
    })

    // we are getting 
   //recieving image
    socket.on('sendImage', (image, callback) => {     
        const user=getUser(socket.id)
        console.log("image recieved")
        io.to(user.room).emit('imageMessage', generateImageMessage(user.username,image))
        callback()
    })

    // send message to all users when a client disconnects
    socket.on('disconnect', () => {
        user=removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('message', generateMessage("admin",`${user.username} has left!`))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
})


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//socket.emit : - sends message to everyone
//io.emit : - sends message to everyone including the sender
//socket.brodcast.emit :- sends message to everyone expect the sender