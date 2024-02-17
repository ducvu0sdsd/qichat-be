'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./auth'))
router.use('/v1/api', require('./user'))
router.use('/v1/api', require('./message'))

module.exports = router