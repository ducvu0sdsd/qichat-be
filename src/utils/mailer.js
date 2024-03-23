const nodeMailer = require('nodemailer')

const mailer = process.env.MAIL_MAILER
const host = process.env.MAIL_HOST
const port = process.env.MAIL_PORT
const username = process.env.MAIL_USERNAME
const password = process.env.MAIL_PASSWORD
const encryption = process.env.MAIL_ENCRYPTION
const fromAddress = process.env.MAIL_FROM_ADDRESS
const fromName = process.env.MAIL_FROM_NAME

exports.sendMail = (to, subject, htmlContent) => {
    const tranport = nodeMailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user: username,
            pass: password
        }
    })

    const options = {
        from: fromAddress,
        to,
        subject,
        html: htmlContent
    }

    return tranport.sendMail(options)
}

exports.generateRandomNumber = () => {
    let randomNumber = '';
    for (let i = 0; i < 6; i++) {
        randomNumber += Math.floor(Math.random() * 10); // Sinh số ngẫu nhiên từ 0 đến 9
    }
    return randomNumber;
}