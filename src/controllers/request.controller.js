const requestService = require("../services/request.service")
const responseWithTokens = require("../utils/response")


class RequestController {

    createFriendRequest = async (req, res) => {
        const { fromUser, toUser } = req.body
        requestService.createFriendRequest({ fromUser, toUser })
            .then((request) => {
                return responseWithTokens(req, res, request, 201)
            })
            .catch(error => {
                return responseWithTokens(req, res, { error: error.message }, 500)
            })
    }

    getFriendRequestsByUser = async (req, res) => {
        const { user_id } = req.params
        requestService.getFriendRequestByUser(user_id)
            .then(requests => {
                return responseWithTokens(req, res, requests, 200)
            })
            .catch(error => {
                return responseWithTokens(req, res, { error: error.message }, 500)
            })
    }


    refuseRequest = async (req, res) => {
        const { id } = req.params
        requestService.refuseRequest(id)
            .then((requests) => {
                return responseWithTokens(req, res, requests, 200)
            })
            .catch(error => {
                return responseWithTokens(req, res, { error: error.message }, 500)
            })
    }

    acceptRequest = async (req, res) => {
        const { request } = req.body
        requestService.acceptRequest(request)
            .then((result) => {
                return responseWithTokens(req, res, result, 200)
            })
            .catch(error => {
                return responseWithTokens(req, res, { error: error.message }, 500)
            })
    }

    getRequestBy2User = async (req, res) => {
        const { user_id1, user_id2 } = req.body
        requestService.getRequestBy2User(user_id1, user_id2)
            .then((result) => {
                return responseWithTokens(req, res, result, 200)
            })
            .catch(error => {
                return responseWithTokens(req, res, { error: error.message }, 500)
            })
    }
}

module.exports = new RequestController()