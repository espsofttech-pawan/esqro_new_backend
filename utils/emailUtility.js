const nodeMailer = require('nodemailer')
const config = require('../config')

module.exports = {
    mailOptions(to, subject, html) {
        return {
            from: config.otp.user, // sender address
            to: to, // list of receivers
            subject: subject + to, // Subject line
            html: html //html body
        }
    },
    transporter: nodeMailer.createTransport({
        host: config.otp.host,
        port: config.otp.port,
        secure: true,
        // service: config.otp.service,
        auth: {
            user: config.otp.user, // generated ethereal user
            pass: config.otp.pass, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    }),
}