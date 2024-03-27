const messageService = require('../services/message.service')
const userService = require('../services/user.service')
const roomService = require('../services/room.service')
const { Server } = require('socket.io')


const socket = (server, baseURL) => {

    const io = new Server(server, {
        cors: {
            cors: {
                origin: baseURL,
                methods: ["GET", "POST", "PUT", "DELETE"]
            },
        }
    })

    io.on('connection', (socket) => {

        socket.on('update_seen', async (data) => {
            const { user_id, seen, room_id, users } = data
            const room = await roomService.updateSeen(room_id, user_id, seen)
            io.emit(`update_seen_${room_id}`, room)
        })

        socket.on('send_emoji_or_disable', async (data) => {
            const { room_id } = data
            await messageService.updateMessage(data)
            io.emit(room_id, await messageService.getMessagesByRoom(room_id))
        })

        socket.on('send_message', async (data) => {
            const { room_id, reply, information, typeMessage, user_id, users } = data
            await messageService.sendMessage({ room_id, reply, information, typeMessage, user_id })
            await roomService.updateLastMessage(room_id, { information, time: new Date() })
            const messages = await messageService.getMessagesByRoom(room_id)
            io.emit(room_id, messages)
            const body = {
                friends_id: users
            }
            io.emit('update-operation-rooms', body)
        })

        socket.on('update-message', async (data) => {
            const { room_id, information, type } = data
            await roomService.updateLastMessage(room_id, { information: `Sent ${information} ${type === 'image' ? 'Pictures' : type === 'video' && 'Videos'}`, time: new Date() })
            const messages = await messageService.getMessagesByRoom(room_id)
            io.emit(room_id, messages)
            const body = {
                room_id
            }
            io.emit('update-operation-rooms', body)
        })

        socket.on('update-room', (friends_id) => {
            const body = {
                friends_id
            }
            io.emit('update-operation-rooms', body)
            io.emit('update-operation-friends', body)
        })

        socket.on('close_operating', async (user) => {
            const userUpdated = await userService.updateOperating(user._id, user.operating)
            const body = {
                friends_id: userUpdated?.friends.map(item => item._id)
            }
            io.emit('update-operation-rooms', body)
            io.emit('update-operation-friends', body)
        })
    })
}

module.exports = socket