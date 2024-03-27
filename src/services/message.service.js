'use strict'

const UpdateChat = require("../..")
const uploadToS3 = require("../AWS/s3")
const messageModel = require("../models/message.model")
const userService = require("../services/user.service")

class MessageService {

    getMessagesByRoom = async (room_id) => {
        let messages = await messageModel.find({ room_id })
        const users_id = []
        const usersPromises = [] // Mảng chứa các promise tìm user
        const users = {}
        messages.forEach(message => {
            if (!users_id.includes(message.user_id))
                users_id.push(message.user_id.toString())
        })

        users_id.forEach(id => {
            const userPromise = userService.findByID(id)
            usersPromises.push(userPromise)
        })

        const usersPromise = await Promise.all(usersPromises)
        usersPromise.forEach(user => {
            users[user?._id.toString()] = user
        })

        messages = messages.map(message => ({
            ...message.toObject(),
            user: users[message.user_id.toString()]
        }))

        return messages
    }


    sendMessage = async (message) => {
        if (message.typeMessage !== 'text' && message.typeMessage !== 'notify') {
            const promises = message.information.map(async (item) => {
                return uploadToS3(`${message.typeMessage}_${Date.now().toString()}_${item.originalname.split('.')[0]}`, item.buffer, item.mimetype)
            });
            const urls = await Promise.all(promises)
            message.information = urls
            message.reply = message.reply === 'null' ? null : message.reply
        }
        return await messageModel.create(message)
    }

    updateMessage = async (message) => {
        await messageModel.findByIdAndUpdate(message._id, message, { new: true })
        return await this.getMessagesByRoom(message.room_id)
    }

    getMediaMessageByRoom = async (room_id) => {
        let messages = await messageModel.find({ room_id })
        let media = messages.reduce((acc, curr) => acc.concat(curr.information), []);
        media = media.filter(item => item.includes('.amazonaws.com/image_') || item.includes('.amazonaws.com/video_'))
        return media
    }
}
module.exports = new MessageService()