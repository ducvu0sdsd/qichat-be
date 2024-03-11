const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var MessageSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    reply: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null
        },
        information: {
            type: String,
            default: null
        }
    },
    information: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    typeMessage: {
        type: String,
        enum: ['text', 'image', 'video', 'voice'],
        required: true,
        default: 'text'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    emojis: [
        {
            status: {
                type: String,
                enum: ['likelike', 'like', 'wow', 'sad', 'smile', 'angry'],
                require: true
            },
            user: {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                fullName: String,
                avatar: String
            }
        }
    ],
    disabled: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Message', MessageSchema);