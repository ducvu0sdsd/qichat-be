'use strict'

const messageService = require('../services/message.service')
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
        const { room_id, reply, user_id, file_title } = req.body;
        const information = req.files
        messageService.sendMessage({ room_id, reply, information, typeMessage: 'file', user_id, file_title })
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
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    getFilesMessageByRoom = async (req, res) => {
        const { id } = req.params
        messageService.getFileMessageByRoom(id)
            .then(media => responseWithTokens(req, res, media, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

}
module.exports = new MessageController() 