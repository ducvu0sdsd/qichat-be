
const roomModel = require('../models/room.model')
const userService = require('./user.service')
const sortByLastMessageTimeDescending = require('../utils/sortRoom')

class RoomService {
    createRoom = async (users, name, type, image = '') => {
        return await roomModel.create({ users, name, type, image })
    }

    updateLastMessage = async (id, lastMessage) => {
        const room = await roomModel.findById(id).lean()
        room.lastMessage = lastMessage
        return await roomModel.findByIdAndUpdate(id, room)
    }

    update = async (room, id) => {
        await roomModel.findByIdAndUpdate(room._id, room)
        return await this.getRoomsByUser(id)
    }

    getGroupsByUser = async (id) => {
        const rooms = await roomModel.find().lean()
        const roomsByUser = []
        rooms.forEach(room => {
            const userIds = room.users.map(user => user._id.toString()); // Chuyển đổi ObjectId thành chuỗi
            if (userIds.includes(id) && room.type === 'Group') {
                roomsByUser.push(room);
            }
        });
        return roomsByUser
    }

    getRoomsByUser = async (id) => {
        let rooms = await roomModel.find().lean()
        const roomsByUser = []
        const users = await userService.findAll()
        rooms.forEach(room => {
            const userIds = room.users.map(user => user._id.toString()); // Chuyển đổi ObjectId thành chuỗi
            if (userIds.includes(id)) {
                let arr = room.users.map(user => {
                    const userFound = users.filter(item => item._id.toString() === user._id.toString())[0]
                    return { ...user, operating: userFound.operating }
                })
                room.users = arr
                roomsByUser.push(room);
            }
        })
        return sortByLastMessageTimeDescending(roomsByUser)
    }
}

module.exports = new RoomService()  