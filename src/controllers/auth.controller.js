'use strict'

const authService = require("../services/auth.service");
const userService = require("../services/user.service");
const responseWithTokens = require("../utils/response");

class AccessController {

    sendVerifyCodeEmail = async (req, res) => {
        const { email } = req.params
        authService.sendVerifyCodeEmail(email)
    }

    verifyEmail = async (req, res) => {
        const { code, email } = req.body
        authService.verifyEmail(email, code)
            .then(result => responseWithTokens(req, res, result, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    signUp = async (req, res) => {
        const { phone, password } = req.body;
        authService.signUp(phone, password)
            .then(response => {
                return res.status(200).json(response);
            })
            .catch((error) => {
                console.log(error)
                return res.status(500).json(error.message);
            });
    }

    signIn = async (req, res) => {
        try {
            const { phone, password } = req.body;
            authService.signIn(phone, password)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch((response) => {
                    return responseWithTokens(req, res, response, 500)
                });
        } catch (error) {
            console.log(error)
            return responseWithTokens(req, res, error, 500)
        }
    }

    generateToken = async (req, res) => {
        const body = req.body
        authService.generateTokens(body)
            .then(tokens => {
                return res.status(200).json(tokens)
            })
    }

    signUpWithGoogle = async (req, res) => {
        try {
            const { email, avatar } = req.body;
            authService.signUpWithGoogle(email, avatar)
                .then(user => res.status(201).json(user))
                .catch(error => {
                    return res.status(500).json(error.message)
                })
        } catch (error) {
            console.log(error);
        }
    }

    signInWithGoogle = async (req, res) => {
        try {
            const { email } = req.body;
            authService.signInWithGoogle(email)
                .then(user => res.status(201).json(user))
                .catch(error => {
                    return res.status(500).json(error.message)
                })
        } catch (error) {
            console.log(error);
        }
    }

    getUserByID = async (req, res) => {
        const user = await userService.findByID(req.headers.userid)
        const users = await userService.findAll()
        user.password = ''
        user.friends = user.friends.map(friend => {
            const friendFound = users.filter(item => item._id.toString() === friend._id.toString())[0]
            return friendFound
        })
        return responseWithTokens(req, res, user, 200)
    }
}

module.exports = new AccessController()