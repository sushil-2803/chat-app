const socket =io()

const $messageForm = document.querySelector('#chat-app')
const $messageFormInput = $messageForm.querySelector('#message')
const $messageFormButton = $messageForm.querySelector('#send')
const $sendLocation = document.querySelector('#send-location')

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    const message=document.getElementById('message').value

    // emit is used to emit an event to the server
    // first param is event name
    // second param is the content, variable,
    // third param is ack for the completion of event - Not Complosury
    socket.emit('sendMessage',message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
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

$sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Gelocation Not support by browser')
    }

    $sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, ()=>{
            $sendLocation.removeAttribute('disabled')
            console.log("Location Shared!")
        })
    })
})