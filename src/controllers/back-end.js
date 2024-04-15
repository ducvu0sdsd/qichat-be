// no se di den cai router nay
router.post('/messages', middleware.checkToken, upload.array('information'), MessageController.sendMessageWithFiles)


// controller sendMessage voi file
sendMessageWithFiles = async (req, res) => {
    const { room_id, reply, user_id, file_title } = req.body;
    const information = req.files
    messageService.sendMessage({ room_id, reply, information, typeMessage: 'file', user_id, file_title })
        .then(message => {
            return responseWithTokens(req, res, message, 200)
        })
        .catch(error => responseWithTokens(req, res, error, 500))
}

// no se dan den cai service nay
sendMessage = async (message) => {
    if (message.typeMessage !== 'text' && message.typeMessage !== 'notify') {
        let promises = []
        promises = message.information.map(async (item, index) => {
            return uploadToS3(`${item.mimetype.split('/')[0] !== 'application' ? item.mimetype.split('/')[0] : item.originalname.split('.')[item.originalname.split('.').length - 1]}___${Date.now().toString()}_${item.originalname.split('.')[0]}`, item.buffer, item.mimetype, message.file_title[index + 1], item.size / 1024)
        });
        const urls = await Promise.all(promises)
        message.information = urls
        message.reply = message.reply === 'null' ? null : message.reply
    }
    return await messageModel.create(message)
}

// ong phai tao 1 cai s3 va 1 iam user (tao trong AWS cua ong)
const AWS = require('aws-sdk')
require('dotenv').config()
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME

const uploadToS3 = (filePath, file, type, name, size) => new Promise((reject, resolve) => {
    {
        const paramsS3 = {
            Bucket: bucketName,
            Key: filePath,
            Body: file,
            ContentType: type,
        }

        s3.upload(paramsS3, async (err, data) => {
            if (err) {

            } else {
                const imageURL = data.Location
                reject({ url: imageURL, name, size: Number(size?.toFixed(2)) })
            }
        })
    }
})

module.exports = uploadToS3


//---------------------------------------------------------------------------------
// ben mobile
