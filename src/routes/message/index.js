'use strict'

const express = require('express')
const MessageController = require('../../controllers/message.controller')
const middleware = require('../../controllers/middleware')
const upload = require('../../upload/upload')
const router = express.Router()

router.get('/get-messages-by-room/:id', middleware.checkToken, MessageController.getMessagesByRoom)
router.put('/messages', middleware.checkToken, MessageController.updateMessage)
router.post('/messages', middleware.checkToken, upload.array('information'), MessageController.sendMessageWithFiles)
router.get('/messages/:id', middleware.checkToken, MessageController.getMediaMessageByRoom)

module.exports = router