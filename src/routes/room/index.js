'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const roomController = require('../../controllers/room.controller')

router.post('/rooms', middleware.checkToken, roomController.createRoom)
router.get('/groups/:id', middleware.checkToken, roomController.getGroupsByUser)
router.get('/rooms/:id', middleware.checkToken, roomController.getRoomsByUser)

module.exports = router