const socket = io()

const $messageForm = document.querySelector('#message-form')
const $imageForm = document.querySelector('#image-form')
const $messageFormInput = $messageForm.querySelector('#message')
const $messageFormButton = $messageForm.querySelector('#send')
const $imageFormButton = $imageForm.querySelector('#upload')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const imageTemplate = document.querySelector('#image-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

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
            // return console.log("Profanity not allowed")
        }
        else {
            // console.log('Delivered!')
        }
    })
})

//emit image
$imageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $imageFormButton.setAttribute('disabled', 'disabled')
    const image = document.getElementById('image')
    const file=image.files[0]
    if(file.size>500000){
        alert("Image size should be less than 500kb")
        $imageFormButton.removeAttribute('disabled')
        return
    }
    const reader = new FileReader()
    reader.onload=function(e){
        console.log("image loaded")
        const image=e.target.result
        socket.emit('sendImage', image, (error) => {
            $imageFormButton.removeAttribute('disabled')
            document.getElementById('image').value = ''
        })
    }
    if(file){
        reader.readAsDataURL(file)
    }else{
        alert("Please select an image")
        $imageFormButton.removeAttribute('disabled')
    }
})


const autoscroll = function(){
    //getting the lastest message
    const $newMessage =$messages.lastElementChild
    console.log($newMessage)
    //height of the new message
    const newMessageStyles= getComputedStyle($newMessage)
    const newMessageMargin= parseInt(newMessageStyles.marginBottom)
    const newMessageHeight= $newMessage.offsetHeight+ newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    // height of message containter
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled
    const scrollOffset = $messages.scrollTop+visibleHeight

    if(Math.round(containerHeight - newMessageHeight) <= Math.round(scrollOffset)){
        $messages.scrollTop=$messages.scrollHeight
    }

    
}
// revices a message and displays on the screen
socket.on('message', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate, { username:message.username,message: message.text, createdAt: moment(message.createdAt).format('h:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// recives location message
socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, { username:location.username,location: location.location, createdAt: moment(location.createdAt).format('h:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// recives image message
socket.on('imageMessage', (image) => {
    const html = Mustache.render(imageTemplate, { username:image.username,image: image.image, createdAt: moment(image.createdAt).format('h:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{room,users})
    document.querySelector('#sidebar').innerHTML=html
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
            // console.log("Location Shared!")
        })
    })
})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
