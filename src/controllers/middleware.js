'use strict'

const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

class Middleware {

    checkToken = async (req, res, next) => {
        try {
            const accessToken = req.headers.accesstoken
            const refreshToken = req.headers.refreshtoken
            const user_id = req.headers.userid
            const admin = req.headers.admin
            if (!user_id || !admin || !refreshToken) {
                return res.status(500).send('Not Found Information');
            }
            jwt.verify(accessToken, process.env.SECRETKEY, (err, decodedAccessToken) => {
                if (err) {
                    jwt.verify(refreshToken, process.env.SECRETKEY, async (error, decodedRefreshToken) => {
                        try {
                            if (error) {
                                return res.status(500).send('Tokens Expired');
                            }
                            const expR = decodedRefreshToken.exp * 1000;
                            const currentTimestamp = new Date().getTime()
                            const newTokens = await authService.generateTokens({ user_id, admin }, `${(expR - currentTimestamp) / 1000}s`)
                            req.tokens = newTokens;
                            next()
                        } catch (error) {
                            return res.status(500).send('Tokens Expired');
                        }
                    })
                }
                else {
                    req.tokens = { accessToken, refreshToken }
                    next()
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new Middleware()