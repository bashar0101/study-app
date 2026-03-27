const nodemailer = require('nodemailer');
const config = require('../config/env');

const smtpConfigured = !!(config.email.smtp.host && config.email.smtp.auth.user);

let transport = null;
if (smtpConfigured) {
  transport = nodemailer.createTransport(config.email.smtp);

  /* istanbul ignore next */
  if (config.env !== 'test') {
    transport
      .verify()
      .then(() => console.log('Connected to email server'))
      .catch(() => console.error('Unable to connect to email server. Check smtp settings in .env'));
  }
} else {
  console.log('[Email] SMTP not configured — emails will be logged to console instead');
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  if (!transport) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}\n${text}`);
    return;
  }
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Verify your email';
  const verificationEmailUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4f46e5; text-align: center;">Welcome to StudyAI!</h2>
      <p>Dear student,</p>
      <p>Thank you for signing up for StudyAI. To get started, please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationEmailUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p style="font-size: 14px; color: #666;">If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="font-size: 12px; color: #4f46e5; word-break: break-all;">${verificationEmailUrl}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">If you did not create an account, please ignore this email.</p>
    </div>
  `;
  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendVerificationEmail,
};
