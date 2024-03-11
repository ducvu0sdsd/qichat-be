'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const roomController = require('../../controllers/room.controller')
const upload = require('../../upload/upload')

router.post('/rooms', middleware.checkToken, upload.single('image'), roomController.createRoom)
router.get('/groups/:id', middleware.checkToken, roomController.getGroupsByUser)
router.get('/rooms/:id', middleware.checkToken, roomController.getRoomsByUser)
router.put('/rooms/:id', middleware.checkToken, roomController.update)
router.delete('/rooms/:id', middleware.checkToken, roomController.delete)
module.exports = router