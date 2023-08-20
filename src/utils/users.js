const users=[]

//addUser, removeUser, getUsers, getUsersInRoom
const addUser = ({id,username,room})=>{
    //Clean the data
    username=username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate date
    if(!username || !room){
        return {
            error:'Usernam and Room required'
        }
    }
    
    //checking for existing user
    const exsistingUser=users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate

    if(exsistingUser){
        return{
            error:"Uesrname in Use!"
        }
    }

    // Store user
    const user={id,username,room}
    user.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id===id)
    if(index != -1)
    {
        return users.splice(index,1)[0]
    }
}