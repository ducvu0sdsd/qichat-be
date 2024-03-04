const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const { Server } = require('socket.io')
const app = express()
const dotenv = require('dotenv')
const https = require('https')
const cors = require('cors');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');
const messageService = require('./src/services/message.service')
const userService = require('./src/services/user.service')
const roomService = require('./src/services/room.service')
const port = 8080

// config
dotenv.config();

const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: 'https://www.qichat.online',
    allowedHeaders: ['Content-Type', 'accessToken', 'refreshToken', 'user_id', 'admin']
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
const io = new Server(server, {
    cors: {
        cors: {
            origin: 'https://www.qichat.online',
            methods: ["GET", "POST", "PUT", "DELETE"]
        },
    }
})

io.on('connection', (socket) => {
    socket.on('send_emoji', async (data) => {
        const { room_id } = data
        await messageService.updateMessage(data)
        io.emit(room_id, await messageService.getMessagesByRoom(room_id))
    })
    socket.on('send_message', async (data) => {
        const { room_id, reply, information, typeMessage, user_id } = data
        await messageService.sendMessage({ room_id, reply, information, typeMessage, user_id })
        await roomService.updateLastMessage(room_id, { information, time: new Date() })
        io.emit(room_id, await messageService.getMessagesByRoom(room_id))
        io.emit('update-operation')
    })
    socket.on('update-room', () => {
        io.emit('update-operation')
    })
    socket.on('close_operating', async (user) => {
        await userService.update(user._id, user)
    })
})

server.listen(port, () => {
    console.log("Running with port " + port)
})
