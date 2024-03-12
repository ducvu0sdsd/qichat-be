'use strict'
const { default: mongoose } = require("mongoose")

class Database {
    constructor() {
        this.connect()
    }

    // connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            // mongoose.set('debug', true)
            // mongoose.set('debug', { color: true })
        }

        mongoose.connect(process.env.MONGODB, { maxPoolSize: 50 })
            .then(_ => {
                const { countConnect } = require('../helpers/check.connect')
                console.log('Connected Mongodb Success ', countConnect())
            })
            .catch(err => console.log(err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb