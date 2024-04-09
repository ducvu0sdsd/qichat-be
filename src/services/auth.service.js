'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');
const authUtils = require("../utils/auth")
const jwt = require('jsonwebtoken');
const { sendMail, generateRandomNumber } = require("../utils/mailer");
const userService = require("./user.service");
let QUEUE_VERIFICATIONS = []

class AuthService {

    sendVerifyCodeEmail = async (email) => {
        const emailFound = QUEUE_VERIFICATIONS.filter(item => item.email === email)[0]
        let code = generateRandomNumber()
        if (emailFound) {
            code = emailFound.verifyCode
        } else {
            QUEUE_VERIFICATIONS.push({ email, verifyCode: code })
        }
        sendMail(email, 'Verification Your Gmail', `<p>Code: ${code}</p>`)
    }

    verifyEmail = async (email, code) => {
        const emailFound = QUEUE_VERIFICATIONS.filter(item => item.email === email)[0]
        if (emailFound) {
            if (emailFound.verifyCode === code) {
                QUEUE_VERIFICATIONS = QUEUE_VERIFICATIONS.filter(item => item.email !== email)
                return { message: 'Verify Email Successfully!!!' }
            } else {
                throw new Error("Verify code don't match")
            }
        } else {
            throw new Error('Email Verify Invalid')
        }
    }

    signUp = async (phone, password) => {
        const user = await userModel.findOne({ phone })
        if (user)
            throw new Error('Phone already exists in system')
        else {
            const passwordEncode = await authUtils.hashPassword(password)
            const userResult = await userModel.create({ phone, password: passwordEncode })
            userResult.password = ''
            return userResult
        }
    }

    signIn = async (phone, pass) => {
        try {
            const user = await userModel.findOne({ phone })
            const users = await userService.findAll()
            const isMatch = await bcrypt.compare(pass, user.password);
            user.password = ''
            user.friends = user.friends.map(friend => {
                const friendFound = users.filter(item => item._id.toString() === friend._id.toString())[0]
                return friendFound
            })
            if (isMatch) {
                if (user.statusSignUp === 'Complete Sign Up') {
                    return {
                        user,
                        tokens: await this.generateTokens({ user_id: user._id, admin: user.admin })
                    }
                } else {
                    return {
                        user,
                        tokens: {}
                    }
                }
            }
        } catch (error) {
            throw new Error('Not Found User');
        }
    }

    generateTokens = async (user, expire) => {
        const accessToken = jwt.sign(user, process.env.SECRETKEY, { expiresIn: process.env.ACCESSEXPIRES });
        const refreshToken = jwt.sign(user, process.env.SECRETKEY, { expiresIn: expire ? expire : process.env.REFRESHEXPIRES });
        return {
            accessToken,
            refreshToken
        }
    }

    signUpWithGoogle = async (email, avatar) => {
        const user = await userModel.findOne({ email })
        if (user)
            throw new Error('Email already exists in system')
        else {
            const userResult = await userModel.create({ email, avatar })
            return userResult
        }
    }

    signInWithGoogle = async (email) => {
        const user = await userModel.findOne({ email })
        if (!user)
            throw new Error('Not Found User')
        else {
            return {
                user,
                tokens: await this.generateTokens({ user_id: user._id, admin: user.admin })
            }
        }
    }
}

module.exports = new AuthService()