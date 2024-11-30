// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // 1) Create A Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production', // Ignore self-signed certificate issues
    },
    // secure: process.env.NODE_ENV === 'production',
    // pool: true, // Enable connection pooling
    // connectionTimeout: 150000, // 2.5 minutes
    // dnsTimeout: 150000, // 2.5 minutes
    // Activate in gmail "less secure app" option in case I'm using GMAIL
  });

  // 2) Define the email options
  const mailOptions = {
    from: `BEGENONE <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: {},
  };

  // 3) Actually send the emails
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
