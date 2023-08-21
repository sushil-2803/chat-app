const users = []

//addUser, removeUser, getUsers, getUsersInRoom
const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate date
    if (!username || !room) {
        return {
            error: 'Usernam and Room required'
        }
    }

    //checking for existing user
    const exsistingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate

    if (exsistingUser) {
        return {
            error: "Username in Use!"
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

//get a user
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

//return users in room
const getUsersInRoom = (room) => {
    userInRoom = users.filter((user) => {
        return user.room === room.trim().toLowerCase()
    })
    return userInRoom
}
module.exports = { addUser, removeUser, getUser, getUsersInRoom }