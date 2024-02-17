'use strict'

const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

class Middleware {

    checkToken = async (req, res, next) => {
        const accessToken = req.headers.accesstoken
        const refreshToken = req.headers.refreshtoken
        const user_id = req.headers.user_id
        const admin = req.headers.admin
        jwt.verify(accessToken, process.env.SECRETKEY, (err, decodedAccessToken) => {
            if (err) {
                jwt.verify(refreshToken, process.env.SECRETKEY, async (error, decodedRefreshToken) => {
                    try {
                        if (error) {
                            throw new Error('Tokens Expired')
                        }
                        const expR = decodedRefreshToken.exp * 1000;
                        const currentTimestamp = new Date().getTime()
                        const newTokens = await authService.generateTokens({ user_id, admin }, `${(expR - currentTimestamp) / 1000}s`)
                        req.tokens = newTokens;
                        next()
                    } catch (error) {
                        throw new Error('Tokens Expired')
                    }
                })
            }
            else {
                req.tokens = { accessToken, refreshToken }
                next()
            }
        });
    }

}

module.exports = new Middleware()