const generateMessage= (username,text)=>{
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}
const generateLocationMessage=(username,location)=>{
    return {
        username,
        location,
        createdAt:new Date().getTime()
    }
}
const generateImageMessage=(username,image)=>{
    return {
        username,
        image,
        createdAt:new Date().getTime()
    }
}
module.exports={
    generateMessage,
    generateLocationMessage,
    generateImageMessage
}