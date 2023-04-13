const socket =io()

document.querySelector('#chat-app').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=document.getElementById('message').value
    socket.emit('sendMessage',message)
})

socket.on('message',(message)=>{
    console.log(message)
})

document.getElementById('send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Gelocation Not support by browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    })
})