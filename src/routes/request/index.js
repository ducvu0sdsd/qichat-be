'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const requestController = require('../../controllers/request.controller')


router.post('/requests', middleware.checkToken, requestController.createFriendRequest)
router.get('/requests/:user_id', middleware.checkToken, requestController.getFriendRequestsByUser)
router.delete('/requests/:id', middleware.checkToken, requestController.refuseRequest)
router.post('/requests/accept-request', middleware.checkToken, requestController.acceptRequest)

module.exports = router