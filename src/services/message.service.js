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
        console.log(message)
        if (message.typeMessage !== 'text' && message.typeMessage !== 'notify') {
            let promises = []
            promises = message.information.map(async (item, index) => {
                return uploadToS3(`${item.mimetype.split('/')[0] !== 'application' ? item.mimetype.split('/')[0] : item.originalname.split('.')[item.originalname.split('.').length - 1]}___${Date.now().toString()}_${item.originalname.split('.')[0]}`, item.buffer, item.mimetype, message.file_title[index + 1], item.size / 1024)
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
        let messages = await messageModel.find({ room_id });
        let media = messages.reduce((acc, curr) => {
            if (curr.typeMessage === 'file') {
                return acc.concat(curr.information);
            }
            return acc;
        }, []);
        media = media.filter(item => item.url.includes('.amazonaws.com/image_') || item.url.includes('.amazonaws.com/video_'));
        return media;
    }

    getFileMessageByRoom = async (room_id) => {
        let messages = await messageModel.find({ room_id });
        let files = messages.reduce((acc, curr) => {
            if (curr.typeMessage === 'file') {
                return acc.concat(curr.information);
            }
            return acc;
        }, []);
        files = files.filter(item => (!item.url.includes('.amazonaws.com/image___') && !item.url.includes('.amazonaws.com/video___')))
        return files
    }
}
module.exports = new MessageService()