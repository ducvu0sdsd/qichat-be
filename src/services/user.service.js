'use strict'

const userModel = require("../models/user.model")

class UserService {

    update = async (id, body) => {
        const user = await userModel.findByIdAndUpdate(id, body, { new: true })
        user.password = ''
        return user
    }
}

module.exports = new UserService()