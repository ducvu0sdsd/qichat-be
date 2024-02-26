
const { Types, default: mongoose } = require('mongoose')
const roomModel = require('../models/room.model')

class RoomService {
    createRoom = async (users, name, type, image = '') => {
        return await roomModel.create({ users, name, type, image })
    }

    getRoomsByUser = async (id) => {
        const rooms = await roomModel.find()
        const roomsByUser = []
        rooms.forEach(room => {
            const userIds = room.users.map(user => user._id.toString()); // Chuyển đổi ObjectId thành chuỗi
            if (userIds.includes(id) && room.type === 'Group') {
                roomsByUser.push(room);
            }
        });
        return roomsByUser
    }
}

module.exports = new RoomService()