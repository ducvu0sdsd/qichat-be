'use strict'

const express = require('express')
const MessageController = require('../../controllers/message.controller')
const middleware = require('../../controllers/middleware')
const router = express.Router()

router.get('/get-messages-by-room/:id', middleware.checkToken, MessageController.getMessagesByRoom)
router.put('/messages', middleware.checkToken, MessageController.updateMessage)

module.exports = router