const socket =io()

document.querySelector('#chat-app').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=document.getElementById('message').value
    socket.emit('sendMessage',message)
})

socket.on('message',(message)=>{
    console.log(message)
})