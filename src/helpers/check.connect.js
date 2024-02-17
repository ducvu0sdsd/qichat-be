'use strict'

const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require('process')
const _SECOND = 5000

// check number of connection
const countConnect = () => {
    const numberOfConnection = mongoose.connect.length
    return numberOfConnection
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numberOfConnection = mongoose.connect.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        console.log(`Active Connection : ${numberOfConnection}`)
        console.log('Memory usage : ' + memoryUsage / 1024 / 1024 + ' MB')

        const maxConnection = numCores * 5
        if (numberOfConnection > maxConnection) {
            console.log('Connection overload detected')
        }

    }, _SECOND) // monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}
