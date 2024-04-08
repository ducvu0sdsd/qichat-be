'use strict'

const express = require('express')
const MessageController = require('../../controllers/message.controller')
const middleware = require('../../controllers/middleware')
const upload = require('../../upload/upload')
const router = express.Router()

router.get('/get-messages-by-room/:id', middleware.checkToken, MessageController.getMessagesByRoom)
router.put('/messages', middleware.checkToken, MessageController.updateMessage)
router.post('/messages', middleware.checkToken, upload.array('information'), MessageController.sendMessageWithFiles)
router.post('/messages-mobile', middleware.checkToken, MessageController.sendMessageWithFilesMobile)
router.get('/messages/media/:id', middleware.checkToken, MessageController.getMediaMessageByRoom)
router.get('/messages/files/:id', middleware.checkToken, MessageController.getFilesMessageByRoom)

module.exports = router