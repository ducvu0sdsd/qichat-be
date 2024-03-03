'use strict'

const authService = require("../services/auth.service")
const userService = require("../services/user.service");
const responseWithTokens = require("../utils/response");

class UserController {

    update = async (req, res) => {
        try {
            const id = req.params.id;
            const { statusSignUp } = req.body
            userService.update(id, req.body)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(() => {
                    return res.status(500).json({ error: `Update failed` });
                });
        } catch (error) {
            console.log(error)
        }
    }

    findByName = async (req, res) => {
        try {
            const { name } = req.params;
            userService.findByName(name)
                .then(users => {
                    return responseWithTokens(req, res, users, 200)
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    findByEmail = async (req, res) => {
        try {
            const { email } = req.params;
            userService.findByEmail(email)
                .then(users => {
                    return responseWithTokens(req, res, users, 200)
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    findByPhone = async (req, res) => {
        try {
            const { phone } = req.params;
            userService.findByPhone(phone)
                .then(users => {
                    return responseWithTokens(req, res, users, 200)
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    getFriendsOperating = async (req, res) => {
        const { id } = req.params
        userService.getFriendsOperating(id)
            .then(users => responseWithTokens(req, res, users, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }
}

module.exports = new UserController()