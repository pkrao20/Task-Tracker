const nodemailer = require("nodemailer");

const sendEmail = ( options ) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: "pkraojee2020@gmail.com",
            pass: process.env.APP_PASSWORD,
        },
    });
    
    const mailOptions = {
        from:"pkraojee2020@gmail.com",
        to:options.to,
        subject: options.subject,
        html: options.html
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
};

module.exports = { sendEmail };