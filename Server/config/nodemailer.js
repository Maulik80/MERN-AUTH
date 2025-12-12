import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({

          host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports like 587
    auth: {
        user: 'maulikgandhi80@gmail.com',
        pass: 'xoqwkuctriyteiig' // App password, keep this secure
    }

});

export default transporter;