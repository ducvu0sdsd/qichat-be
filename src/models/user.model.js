// !mdbgum

const mongoose = require('mongoose'); // Erase if already required
const moment = require('moment-timezone');

// Thiết lập múi giờ mặc định là 'Asia/Ho_Chi_Minh'
moment.tz.setDefault('Asia/Ho_Chi_Minh');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
        default: 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0'
    },
    password: {
        type: String,
    },
    friends: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // để chỉ đến mô hình User nếu bạn đang thực hiện quan hệ với chính bản thân mô hình User
            },
            fullName: String,
            avatar: String,
            block: {
                type: Boolean,
                default: false
            }
        }
    ],
    statusSignUp: {
        type: String,
        enum: ['Complete Step 1', 'Complete Step 2', 'Complete Sign Up'],
        default: 'Complete Step 1'
    },
    admin: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        require: true
    },
    operating: {
        status: {
            type: Boolean,
            default: false
        },
        time: {
            type: Date,
        }
    },
    notifications: {
        type: [
            {
                title: {
                    type: String
                },
                body: {
                    type: String
                },
                image: {
                    type: [String],
                    default: []
                },
                message: {
                    type: mongoose.Schema.Types.Mixed,
                    default: null
                },
                time: {
                    type: Date
                },
                watched: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    disable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('User', userSchema);
