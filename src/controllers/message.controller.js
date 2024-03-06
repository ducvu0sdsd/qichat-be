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
        const { room_id, reply, typeMessage, user_id } = req.body;
        const information = req.files
        messageService.sendMessage({ room_id, reply, information, typeMessage, user_id })
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

}
module.exports = new MessageController() 