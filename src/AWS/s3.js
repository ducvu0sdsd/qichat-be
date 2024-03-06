const AWS = require('aws-sdk')
require('dotenv').config()
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME

const uploadToS3 = (filePath, file, type) => new Promise((reject, resolve) => {
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
                reject(imageURL)
            }
        })
    }
})

module.exports = uploadToS3