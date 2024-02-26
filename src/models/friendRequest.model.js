const mongoose = require('mongoose'); // Erase if already required

var FriendRequestSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('FriendRequest', FriendRequestSchema);