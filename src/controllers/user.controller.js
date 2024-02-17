'use strict'

const authService = require("../services/auth.service")
const userService = require("../services/user.service")

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

}

module.exports = new UserController()