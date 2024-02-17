'use strict'

const express = require('express')
const AccessController = require('../../controllers/auth.controller')
const middleware = require('../../controllers/middleware')
const router = express.Router()

//sign up
router.post('/sign-up', AccessController.signUp)
router.post('/sign-up-with-google', AccessController.signUpWithGoogle)
router.post('/sign-in', AccessController.signIn)
router.post('/sign-in-with-google', AccessController.signInWithGoogle)
router.post('/generate-tokens', AccessController.generateToken)
router.post('/check-tokens', middleware.checkToken, AccessController.checkToken)

module.exports = router  