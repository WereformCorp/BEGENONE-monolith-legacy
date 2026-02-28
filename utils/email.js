/**
 * @fileoverview Nodemailer-based email sending utility
 * @module utils/email
 * @layer Utility
 *
 * @description
 * Configures a Nodemailer SMTP transport using environment-defined credentials
 * and provides an async function to send plaintext emails. TLS certificate
 * validation is enforced in production and relaxed in development to support
 * self-signed certificates on local SMTP servers.
 *
 * @dependencies
 * - Upstream: Auth controllers (password reset), notification workflows
 * - Downstream: nodemailer, process.env (EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME,
 *   EMAIL_PASSWORD, EMAIL_FROM)
 *
 * @security
 * SMTP credentials are read from environment variables and must not be hardcoded.
 * TLS validation is conditionally disabled in non-production environments only.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

/**
 * Sends a plaintext email using the configured SMTP transport.
 * @param {Object} options - Email dispatch parameters
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.message - Plaintext email body
 * @returns {Promise<void>} Resolves when the email is sent
 * @throws {Error} Propagates nodemailer transport errors
 * @sideeffect Sends an email via the configured SMTP server
 */
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
