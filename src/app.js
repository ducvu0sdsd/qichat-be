const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors');

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
require('./dbs/init.mongodb')

// init routes
app.use('', require('./routes/index'))

// handling error

module.exports = app