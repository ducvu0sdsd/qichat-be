'use strict'

const express = require('express')
const UserController = require('../../controllers/user.controller')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const userController = require('../../controllers/user.controller')

router.put('/users/:id', UserController.update)
router.get('/users/find-by-name/:name', middleware.checkToken, UserController.findByName)
router.get('/users/find-by-email/:email', middleware.checkToken, UserController.findByEmail)
router.get('/users/find-by-phone/:phone', middleware.checkToken, UserController.findByPhone)

module.exports = router