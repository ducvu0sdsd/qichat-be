'use strict'

const userModel = require("../models/user.model")
const shuffleArray = require("../utils/others")

class UserService {

    findAll = async () => {
        return await userModel.find()
    }

    update = async (id, body) => {
        const user = await userModel.findById(id)
        body.password = user.password
        const userUpdated = await userModel.findByIdAndUpdate(id, body, { new: true })
        if (userUpdated)
            userUpdated.password = ''
        return userUpdated
    }

    findByID = async (id) => {
        try {
            const user = await userModel.findById(id)
            if (user)
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

    getFriendsOperating = async (id) => {
        const users = await userModel.find()
        const ownUser = await userModel.findById(id)
        const friends = users.filter(user => {
            return ownUser.friends.map(item => item._id.toString()).includes(user._id.toString())
        })
        return shuffleArray(friends.filter(friend => friend.operating.status === true))
    }
}

module.exports = new UserService()