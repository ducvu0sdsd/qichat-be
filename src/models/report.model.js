const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo models
var reportSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    message: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        information: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    fromUser: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // để chỉ đến mô hình User nếu bạn đang thực hiện quan hệ với chính bản thân mô hình User
        },
        fullName: String,
        avatar: String
    },
    toUser: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // để chỉ đến mô hình User nếu bạn đang thực hiện quan hệ với chính bản thân mô hình User
        },
        fullName: String,
        avatar: String
    },
    watched: {
        type: Boolean,
        default: false
    }
});

//Export the model
module.exports = mongoose.model('Report', reportSchema);