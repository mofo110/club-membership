/**
 * Send email
 */

function email(emailService, emailUser, emailPass, subject, text) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    const mailOptions = {
        from: emailUser,
        to: emailUser,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = email;