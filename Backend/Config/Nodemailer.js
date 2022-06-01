const nodemailer = require('nodemailer');
const dotenv=require('dotenv')

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.user, // generated ethereal user
    pass: process.env.password, // generated ethereal password
  },
});

module.exports = transporter;
 


