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

        socket.on('send_emoji', async (data) => {
            const { room_id } = data
            await messageService.updateMessage(data)
            io.emit(room_id, await messageService.getMessagesByRoom(room_id))
        })

        socket.on('send_message', async (data) => {
            const { room_id, reply, information, typeMessage, user_id } = data
            await messageService.sendMessage({ room_id, reply, information, typeMessage, user_id })
            await roomService.updateLastMessage(room_id, { information, time: new Date() })
            const messages = await messageService.getMessagesByRoom(room_id)
            io.emit(room_id, messages)
            io.emit('update-operation')
        })

        socket.on('update-message', async (data) => {
            const { room_id, information, type } = data
            console.log(room_id, information, type)
            await roomService.updateLastMessage(room_id, { information: `Sent ${information} ${type === 'image' && 'Pictures'}`, time: new Date() })
            const messages = await messageService.getMessagesByRoom(room_id)
            io.emit(room_id, messages)
            io.emit('update-operation')
        })

        socket.on('update-room', () => {
            io.emit('update-operation')
        })

        socket.on('close_operating', async (user) => {
            await userService.updateOperating(user._id, user.operating)
        })
    })
}

module.exports = socket