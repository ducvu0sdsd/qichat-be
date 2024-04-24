const mongoose = require('mongoose'); // Erase if already required
const moment = require('moment-timezone');

// Thiết lập múi giờ mặc định là 'Asia/Ho_Chi_Minh'
moment.tz.setDefault('Asia/Ho_Chi_Minh');

// Declare the Schema of the Mongo model 
var roomSchema = new mongoose.Schema({
    users: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fullName: String,
            avatar: String,
            seen: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
                default: null
            },
            edit: {
                type: Boolean,
                default: false
            }
        }
    ],
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Single', 'Group'],
        default: 'Single'
    },
    image: {
        type: String,
        default: ''
    },
    lastMessage: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: '5f4a3e1b2c3d4e5f67890abc'
        },
        information: {
            type: mongoose.Schema.Types.Mixed,
            default: 'Start messaging now !!!'
        },
        time: {
            type: Date,
            default: () => moment().toDate()
        }
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Room', roomSchema);