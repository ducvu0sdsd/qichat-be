const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv')
const https = require('http')
const cors = require('cors');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');
const socket = require('./src/utils/socket')
const port = 8080
const baseURL = 'https://www.qichat.online'
// const baseURL = 'http://localhost:3000'

// config
dotenv.config();

const corsOptions = {
    origin: baseURL,
    allowedHeaders: ['Content-Type', 'accessToken', 'refreshToken', 'userid', 'admin']
};

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(cors(corsOptions));
app.use(express.json());

// init db
require('./src/dbs/init.mongodb')

// init routes
app.use('', require('./src/routes/index'))

// socket realtime
const server = https.createServer(app)

socket(server, baseURL)

server.listen(port, () => {
    console.log("Running with port " + port)
})
