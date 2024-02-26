const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const { Server } = require('socket.io')
const app = express()
const dotenv = require('dotenv')
const http = require('http')
const cors = require('cors');
const port = 8080

// config
dotenv.config();

const corsOptions = {
    origin: 'http://localhost:3000',
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
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST", "PUT", "DELETE"]
        },
    }
})

io.on('connection', (socket) => {
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data)
    })
})

server.listen(port, () => {
    console.log("Running with port " + port)
})
