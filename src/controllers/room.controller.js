
const roomService = require('../services/room.service')
const responseWithTokens = require('../utils/response')

class RoomController {

    createRoom = async (req, res) => {
        const { name, type, creator } = req.body
        const users = JSON.parse(req.body.users)
        const image = req.file
        roomService.createRoom(users, name, type, image, creator)
            .then(room => {
                return responseWithTokens(req, res, room, 201)
            })
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error, 500)
            })
    }

    getGroupsByUser = async (req, res) => {
        const { id } = req.params
        roomService.getGroupsByUser(id)
            .then(rooms => {
                return responseWithTokens(req, res, rooms, 200)
            })
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error, 500)
            })
    }

    getRoomsByUser = async (req, res) => {
        const { id } = req.params
        roomService.getRoomsByUser(id)
            .then(rooms => {
                return responseWithTokens(req, res, rooms, 200)
            })
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error, 500)
            })
    }

    update = async (req, res) => {
        const room = req.body
        const { id } = req.params
        roomService.update(room, id)
            .then(newRooms => responseWithTokens(req, res, newRooms, 200))
            .catch(error => responseWithTokens(req, res, error, 200))
    }
}

module.exports = new RoomController()