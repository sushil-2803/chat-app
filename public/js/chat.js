const socket =io()

document.querySelector('#chat-app').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=document.getElementById('message').value

    // emit is used to emit an event to the server
    // first param is event name
    // second param is the content, variable,
    // third param is ack for the completion of event - Not Complosury
    socket.emit('sendMessage',message, (error)=>{
        if(error)
        {
            return console.log("Profanity not allowed")
        }
        else{
            console.log('Delivered!')
        }
    })
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
        }, ()=>{console.log("Location Shared!")})
    })
})