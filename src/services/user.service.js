'use strict'

const uploadToS3 = require("../AWS/s3")
const userModel = require("../models/user.model")
const shuffleArray = require("../utils/others")

class UserService {

    findAll = async () => {
        return await userModel.find().lean()
    }

    updateInformation = async (user, image) => {
        let url = ''
        if (image) {
            url = await uploadToS3(`image_${Date.now().toString()}_${image.originalname.split('.')[0]}`, image.buffer, image.mimetype)
        }
        return await userModel.findByIdAndUpdate(user._id, user, { new: true })
    }

    update = async (id, body) => {
        const user = await userModel.findById(id)
        body.password = user.password
        const userUpdated = await userModel.findByIdAndUpdate(id, body, { new: true })
        if (userUpdated)
            userUpdated.password = ''
        return userUpdated
    }

    updateOperating = async (id, operating) => {
        try {
            let user = await userModel.findById(id)
            user.operating = operating
            return await userModel.findByIdAndUpdate(id, user, { new: true })
        } catch (error) {

        }
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

    unfriend = async (user_id_1, user_id_2) => {
        const user1 = await userModel.findById(user_id_1)
        const user2 = await userModel.findById(user_id_2)
        user1.friends = user1.friends.filter(friend => friend._id.toString() !== user2._id.toString())
        user2.friends = user2.friends.filter(friend => friend._id.toString() !== user1._id.toString())
        const user1Updated = await userModel.findByIdAndUpdate(user1._id, user1, { new: true })
        const user2Updated = await userModel.findByIdAndUpdate(user2._id, user2, { new: true })
        return {
            [user1._id]: user1Updated,
            [user2._id]: user2Updated
        }
    }

    block = async (user_id_1, user_id_2) => {
        const user1 = await userModel.findById(user_id_1)
        user1.friends.filter(item => item._id.toString() === user_id_2.toString())[0].block = true
        const userUpdated = await userModel.findByIdAndUpdate(user_id_1, user1, { new: true })
        if (userUpdated)
            userUpdated.password = ''
        return userUpdated
    }

    unblock = async (user_id_1, user_id_2) => {
        const user1 = await userModel.findById(user_id_1)
        user1.friends.filter(item => item._id.toString() === user_id_2.toString())[0].block = false
        const userUpdated = await userModel.findByIdAndUpdate(user_id_1, user1, { new: true })
        if (userUpdated)
            userUpdated.password = ''
        return userUpdated
    }
}

module.exports = new UserService()