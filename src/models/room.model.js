const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var roomSchema = new mongoose.Schema({
    users: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String
        }
    ],
    name: {
        type: String,
        required: true,
        index: true,
    },
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Room', roomSchema);