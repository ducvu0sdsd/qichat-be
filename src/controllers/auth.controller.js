'use strict'

const authService = require("../services/auth.service");
const responseWithTokens = require("../utils/response");

class AccessController {

    signUp = async (req, res) => {
        const { phone, password } = req.body;
        authService.signUp(phone, password)
            .then(response => {
                return res.status(200).json(response);
            })
            .catch((error) => {
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
                    return res.status(500).json({ error: response });
                });
        } catch (error) {
            console.log(error);
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

    checkToken = async (req, res) => {
        return responseWithTokens(req, res, {}, 200)
    }
}

module.exports = new AccessController()