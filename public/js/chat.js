const socket = io()

const $messageForm = document.querySelector('#chat-app')
const $messageFormInput = $messageForm.querySelector('#message')
const $messageFormButton = $messageForm.querySelector('#send')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = document.getElementById('message').value

    // emit is used to emit an event to the server
    // first param is event name
    // second param is the content, variable,
    // third param is ack for the completion of event - Not Complosury
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log("Profanity not allowed")
        }
        else {
            console.log('Delivered!')
        }
    })
})
// revices a message and displays on the screen
socket.on('message', (message) => {
    console.log(message)
    const html =Mustache.render(messageTemplate,{message:message.text,createdAt:moment(message.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
})

// recives location message
socket.on('locationMessage',(location)=>{
    const html = Mustache.render(locationTemplate,{location:location.location,createdAt:moment(message.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
})

$sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Gelocation Not support by browser')
    }

    $sendLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocation.removeAttribute('disabled')
            console.log("Location Shared!")
        })
    })
})