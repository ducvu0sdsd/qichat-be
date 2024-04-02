'use strict'

const express = require('express')
const UserController = require('../../controllers/user.controller')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const upload = require('../../upload/upload')

router.put('/users/:id', UserController.update)
router.put('/users/update-password/:id', middleware.checkToken, UserController.updatePassWord)
router.put('/users/update-forgot-password/:id', UserController.updatePassWord)
router.put('/users/update-information/:id', middleware.checkToken, upload.single('image'), UserController.updateInformation)
router.post('/users/unfriend', middleware.checkToken, UserController.unfriend)
router.post('/users/block', middleware.checkToken, UserController.block)
router.post('/users/unblock', middleware.checkToken, UserController.unblock)
router.get('/users/:id', middleware.checkToken, UserController.findByID)
router.get('/users/find-by-name/:name', middleware.checkToken, UserController.findByName)
router.get('/users/find-by-email/:email', middleware.checkToken, UserController.findByEmail)
router.get('/users/find-by-phone/:phone', middleware.checkToken, UserController.findByPhone)
router.get('/users/find-by-phone-no-token/:phone', UserController.findByPhone)
router.get('/friends-operating/:id', middleware.checkToken, UserController.getFriendsOperating)

module.exports = router