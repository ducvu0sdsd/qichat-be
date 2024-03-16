'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');
const authUtils = require("../utils/auth")
const jwt = require('jsonwebtoken');

class AuthService {

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
            const isMatch = await bcrypt.compare(pass, user.password);
            user.password = ''
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