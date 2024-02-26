'use strict'

const userModel = require("../models/user.model")

class UserService {

    update = async (id, body) => {
        const user = await userModel.findByIdAndUpdate(id, body, { new: true })
        user.password = ''
        return user
    }

    findByID = async (id) => {
        try {
            const user = await userModel.findById(id)
            user.password = ''
            return user
        } catch (error) {

        }
    }

    findByName = async (name) => {
        const users = await userModel.find()
        users.forEach(user => { user.password = '' })
        const result = users.filter(user => user.fullName?.toLowerCase().trim().includes(name.toLowerCase().trim()))
        return result
    }

    findByPhone = async (phone) => {
        const users = await userModel.find()
        users.forEach(user => { user.password = '' })
        const result = users.filter(user => user.phone?.toLowerCase().trim().includes(phone.toLowerCase().trim()))
        return result
    }

    findByEmail = async (email) => {
        const users = await userModel.find()
        users.forEach(user => { user.password = '' })
        const result = users.filter(user => user.email?.toLowerCase().trim().includes(email.toLowerCase().trim()))
        return result
    }

}

module.exports = new UserService()