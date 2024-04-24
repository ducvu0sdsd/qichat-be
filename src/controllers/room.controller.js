
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
                return responseWithTokens(req, res, error, 500)
            })
    }

    createRoomMobile = async (req, res) => {
        const { name, type, creator, users, image } = req.body
        if (image) {
            const buffer = await Buffer.from(image.base64, 'base64');
            image.buffer = buffer
        }
        roomService.createRoom(users, name, type, image, creator)
            .then(room => {
                return responseWithTokens(req, res, room, 201)
            })
            .catch(error => {
                return responseWithTokens(req, res, error.Message, 500)
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
                return responseWithTokens(req, res, error.message, 500)
            })
    }

    update = async (req, res) => {
        const room = req.body
        const { id } = req.params
        roomService.update(room, id)
            .then(newRooms => responseWithTokens(req, res, newRooms, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    updateImage = async (req, res) => {
        const image = req.file
        const { id } = req.params
        roomService.updateImage(id, image)
            .then(newRoom => responseWithTokens(req, res, newRoom, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    updateImageMobile = async (req, res) => {
        const { image } = req.body
        const { id } = req.params
        image.buffer = await Buffer.from(image.base64, 'base64');
        roomService.updateImage(id, image)
            .then(newRoom => responseWithTokens(req, res, newRoom, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    delete = async (req, res) => {
        const { id } = req.params
        roomService.delete(id)
            .then(newRooms => responseWithTokens(req, res, newRooms, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }
}

module.exports = new RoomController()