'use strict'

const { Error } = require("mongoose")
const friendRequestModel = require("../models/friendRequest.model")
const userModel = require('../models/user.model')
const userService = require("../services/user.service")
const roomService = require('../services/room.service')


class RequestService {

    createFriendRequest = async (body) => {
        // check request already exists in system 
        const requestExists = await friendRequestModel.findOne({ "fromUser._id": body.fromUser._id, "toUser._id": body.toUser._id })
        if (requestExists)
            throw new Error('The Request already exists in system')
        // check request from 'To User' already exists in system
        const requestExists1 = await friendRequestModel.findOne({ "fromUser._id": body.toUser._id, "toUser._id": body.fromUser._id })
        if (requestExists1)
            throw new Error('The Request already exists in system')
        return await friendRequestModel.create(body)
    }

    getFriendRequestByUser = async (user_id) => {
        return await friendRequestModel.find({ "toUser._id": user_id })
    }

    refuseRequest = async (id) => {
        const request = await friendRequestModel.findById(id)
        await friendRequestModel.findByIdAndDelete(id)
        return await friendRequestModel.find({ "toUser._id": request.toUser._id })
    }

    acceptRequest = async (request) => {

        // find 2 User and Update Friends for each user
        const user1 = {
            _id: request.fromUser._id,
            fullName: request.fromUser.fullName,
            avatar: request.fromUser.avatar
        }
        const user2 = {
            _id: request.toUser._id,
            fullName: request.toUser.fullName,
            avatar: request.toUser.avatar
        }
        const userFull_1 = await userService.findByID(user1._id)
        const userFull_2 = await userService.findByID(user2._id)

        if (userFull_1.friends.map(user => user._id).includes(userFull_2._id)) {
            throw new Error('2 Users already make friend each other')
        }

        userFull_1.friends.push(user2)
        userFull_2.friends.push(user1)
        await userService.update(userFull_1._id, userFull_1)
        const newUser = await userService.update(userFull_2._id, userFull_2)

        // Delete Request
        await friendRequestModel.findByIdAndDelete(request._id)

        // Find All Request For Current User
        const requests = await friendRequestModel.find({ "toUser._id": newUser._id })

        // Create Room For 2 User
        await roomService.createRoom([user1, user2], 'none', 'Single')

        return { user: newUser, requests }
    }
}

module.exports = new RequestService()