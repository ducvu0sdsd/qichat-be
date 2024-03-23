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
router.get('/get-user-by-tokens', middleware.checkToken, AccessController.getUserByID)
router.post('/send-verify-code/:email', AccessController.sendVerifyCodeEmail)
router.post('/verify-gmail', AccessController.verifyEmail)

module.exports = router  