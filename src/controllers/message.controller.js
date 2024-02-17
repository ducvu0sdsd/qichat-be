'use strict'

const messageService = require('../services/message.service')
const responseWithTokens = require('../utils/response');

class MessageController {

    sayHello = (req, res) => {
        return responseWithTokens(req, res, { message: 'hello' }, 200)
    }

}
module.exports = new MessageController()