const nodemailer = require('nodemailer')
const { options } = require('../app')

const sendEmail = async options => {
    // Criar um transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
    })

    // Definir detalhes do email
    mailOptions = {
        from: 'YAMDB <noreply@yamdb.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html:
    }

    //Enviar email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail