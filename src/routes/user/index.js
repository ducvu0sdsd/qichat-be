'use strict'

const express = require('express')
const UserController = require('../../controllers/user.controller')
const router = express.Router()

//sign up
router.put('/users/:id', UserController.update)

module.exports = router