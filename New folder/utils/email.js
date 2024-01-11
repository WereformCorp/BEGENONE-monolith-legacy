// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create A Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option in case I'm using GMAIL
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Areesh Alam <areeshalam2@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: {},
  };

  // 3) Actually send the emails
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
