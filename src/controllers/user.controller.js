'use strict'

const authService = require("../services/auth.service")
const userService = require("../services/user.service");
const responseWithTokens = require("../utils/response");

class UserController {

    updateInformation = (req, res) => {
        const user = JSON.parse(req.body.user)
        let image = req.file
        if (req.body.image) {
            image = JSON.parse(req.body.image)
        }
        userService.updateInformation(user, image)
            .then(user => responseWithTokens(req, res, user, 200))
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error.message, 500)
            })
    }

    updatePassWord = (req, res) => {
        const id = req.params.id;
        const { password, newPassword } = req.body
        userService.updatePassword(id, password, newPassword)
            .then(user => responseWithTokens(req, res, user, 200))
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error.message, 500)
            })
    }

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
            return responseWithTokens(req, res, error, 500)
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
                    return responseWithTokens(req, res, error, 500)
                })
        } catch (error) {
            return responseWithTokens(req, res, error, 500)
        }
    }

    findByID = async (req, res) => {
        try {
            const { id } = req.params;
            userService.findByID(id)
                .then(user => {
                    return responseWithTokens(req, res, user, 200)
                })
                .catch(error => {
                    return responseWithTokens(req, res, error, 500)
                })
        } catch (error) {
            return responseWithTokens(req, res, error, 500)
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
                    return responseWithTokens(req, res, error, 500)
                })
        } catch (error) {
            return responseWithTokens(req, res, error, 500)
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
                    return responseWithTokens(req, res, error.message, 500)
                })
        } catch (error) {
            return responseWithTokens(req, res, error.message, 500)
        }
    }

    getFriendsOperating = async (req, res) => {
        const { id } = req.params
        userService.getFriendsOperating(id)
            .then(users => responseWithTokens(req, res, users, 200))
            .catch(error => {
                console.log(error)
                return responseWithTokens(req, res, error, 500)
            })
    }

    unfriend = async (req, res) => {
        const { user_id_1, user_id_2 } = req.body
        userService.unfriend(user_id_1, user_id_2)
            .then(users => responseWithTokens(req, res, users, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    block = async (req, res) => {
        const { user_block, user_id } = req.body
        userService.block(user_block, user_id)
            .then(user => responseWithTokens(req, res, user, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }

    unblock = async (req, res) => {
        const { user_block, user_id } = req.body
        userService.unblock(user_block, user_id)
            .then(user => responseWithTokens(req, res, user, 200))
            .catch(error => responseWithTokens(req, res, error, 500))
    }
}

module.exports = new UserController()