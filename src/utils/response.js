const responseWithTokens = (req, res, data, status) => {
    return res.status(status).json({ data, tokens: req.tokens })
}
module.exports = responseWithTokens;