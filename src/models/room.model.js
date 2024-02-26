const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var roomSchema = new mongoose.Schema({
    users: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fullName: String,
            avatar: String
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
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Room', roomSchema);