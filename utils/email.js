// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // 1) Create A Transporter
  let isProduction;
  if (process.env.NODE_ENV === 'production') {
    isProduction = true;
  } else if (process.env.NODE_ENV === 'development') {
    isProduction = false;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: isProduction, // Ignore self-signed certificate issues
    },
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
