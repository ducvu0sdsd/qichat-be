const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var MessageSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    information: {
        type: String,
        required: true
    },
    typeMessage: {
        type: String,
        enum: ['text', 'image', 'video', 'voice'],
        required: true,
        default: 'text'
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Message', MessageSchema);