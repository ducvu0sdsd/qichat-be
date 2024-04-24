'use strict'

const messageService = require('../services/message.service');
const roomService = require('../services/room.service');
const responseWithTokens = require('../utils/response');

class MessageController {

    getMessagesByRoom = async (req, res) => {
        const { id } = req.params
        messageService.getMessagesByRoom(id)
            .then(messages => {
                return responseWithTokens(req, res, messages, 200)
            })
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    sendMessageWithFiles = async (req, res) => {
        const { room_id, reply, user_id, file_title, transfer = false } = req.body;
        const information = req.files
        messageService.sendMessage({ room_id, reply, information, typeMessage: 'file', user_id, file_title, transfer })
            .then(message => {
                return responseWithTokens(req, res, message, 200)
            })
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    updateMessage = async (req, res) => {
        const message = req.body
        messageService.updateMessage(message)
            .then(newMessages => responseWithTokens(req, res, newMessages, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    getMediaMessageByRoom = async (req, res) => {
        const { id } = req.params
        messageService.getMediaMessageByRoom(id)
            .then(media => responseWithTokens(req, res, media, 200))
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error.message, 500)
            })
    }

    getFilesMessageByRoom = async (req, res) => {
        const { id } = req.params
        messageService.getFileMessageByRoom(id)
            .then(media => responseWithTokens(req, res, media, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    sendMessageWithFilesMobile = async (req, res) => {
        try {
            const { room_id, reply, information, user_id, users, typeMessage, transfer = false } = req.body
            let file_title = ['']
            let processedInformation = await Promise.all(information.map(async item => {
                const buffer = await Buffer.from(item.base64, 'base64');
                file_title.push(item.originalname.split('.')[0])
                return {
                    originalname: item.originalname,
                    mimetype: item.mimetype,
                    buffer,
                    size: item.size,
                };
            }));
            const newMessage = await messageService.sendMessage({ room_id, reply, information: processedInformation, user_id, file_title, typeMessage, transfer })
            await roomService.updateLastMessage(room_id, { information: `Sent ${information.length} ${information.length === 1 ? "file" : "files"}`, time: new Date(), user_id, _id: newMessage._id })
            const messages = await messageService.getMessagesByRoom(room_id)
            return responseWithTokens(req, res, newMessage, 200)
        } catch (error) {
            return responseWithTokens(req, res, error.message, 500)
        }
    }

}
module.exports = new MessageController() 