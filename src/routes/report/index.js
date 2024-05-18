'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const reportController = require('../../controllers/report.controller')


router.post('/reports', middleware.checkToken, reportController.createReport)
router.get('/reports', middleware.checkToken, reportController.findAll)
router.delete('/reports/:id', middleware.checkToken, reportController.delete)
router.put('/reports/:id', middleware.checkToken, reportController.updateSeen)


module.exports = router