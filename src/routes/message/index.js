'use strict'

const express = require('express')
const MessageController = require('../../controllers/message.controller')
const middleware = require('../../controllers/middleware')
const router = express.Router()

router.get('/hello', middleware.checkToken, MessageController.sayHello)

module.exports = router