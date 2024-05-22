
const roomModel = require('../models/room.model')
const userService = require('./user.service')
const sortByLastMessageTimeDescending = require('../utils/sortRoom')
const uploadToS3 = require('../AWS/s3')

class RoomService {

    updateImage = async (id, image) => {
        console.log(1)
        const url = await uploadToS3(`image_${Date.now().toString()}_${image.originalname.split('.')[0]}`, image.buffer, image.mimetype)
        console.log(url)
        await roomModel.updateOne({ _id: id }, { $set: { image: url.url } });
        const roomUpdated = await roomModel.findById(id);
        return roomUpdated;
    }

    createRoom = async (users, name, type, image, creator) => {
        let url = ''
        let created = false
        if (image) {
            url = await uploadToS3(`image_${Date.now().toString()}_${image.originalname.split('.')[0]}`, image.buffer, image.mimetype)
        }
        if (type === 'Single') {
            const rooms = await this.getRoomsByUser(users[0]._id)
            rooms.forEach(room => {
                if (room.type === 'Single') {
                    if (room.users.map(item => item._id.toString()).includes(users[1]._id.toString())) {
                        created = true
                    }
                }
            })
        }
        if (created) {
            return null;
        } else {
            return await roomModel.create({ users, name, type, image: image ? url.url : 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2152974972/settings_images/a05d7f7-f3b7-0102-a18b-52050e1111ad_noun-proactive-5427471-02_2.png', creator })
        }
    }

    updateLastMessage = async (id, lastMessage) => {
        try {
            const room = await roomModel.findById(id).lean()
            room.lastMessage = lastMessage
            return await roomModel.findByIdAndUpdate(id, room)
        } catch (error) {

        }
    }

    update = async (room, id) => {
        const roomUpdated = await roomModel.findByIdAndUpdate(room._id, room, { new: true })
        if (roomUpdated.users.length === 1) {
            await this.delete(room._id)
        }
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
                    // console.log(JSON.stringify(users.filter(item => item._id.toString() === user._id.toString())[0]))
                    const userFound = JSON.parse(JSON.stringify(users.filter(item => item._id.toString() === user._id.toString())[0]))
                    userFound.seen = user.seen
                    userFound.password = ''
                    return userFound
                })
                room.users = arr
                roomsByUser.push(room);
            }
        })
        return sortByLastMessageTimeDescending(roomsByUser)
    }

    delete = async (id) => {
        return await roomModel.findByIdAndDelete(id)
    }

    updateSeen = async (room_id, user_id, seen) => {
        const filter = { _id: room_id, "users._id": user_id };
        const update = { $set: { "users.$.seen": seen } };

        const options = { new: true };
        const updatedRoom = await roomModel.findOneAndUpdate(filter, update, options);

        return updatedRoom;
    }

    addDeputy = async (room_id, user_id) => {
        const updatedRoom = await roomModel.findOneAndUpdate({ _id: room_id }, { $push: { deputies: user_id } }, { new: true })
        return updatedRoom;
    }

    deleteDeputy = async (room_id, user_id) => {
        const updatedRoom = await roomModel.findOneAndUpdate(
            { _id: room_id },
            { $pull: { deputies: user_id } },
            { new: true }
        );
        return updatedRoom;
    }
}

module.exports = new RoomService()  