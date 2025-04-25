const {initializeApp} = require('firebase-admin/app');
const {onDocumentCreated} = require('firebase-functions/v2/firestore');
const {logger} = require('firebase-functions');
const nodemailer = require('nodemailer');
const dns = require('dns'); // 👈 ADD THIS LINE

initializeApp();

const EMAIL_USER = 'noreply@kitchen-queue.com';
const EMAIL_PASS = 'pLp-cHl0GD)x';

const transporter = nodemailer.createTransport(
  {
    host: '50.87.253.20',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    debug: true,
  },
  {
    from: `Kitchen Queue <${EMAIL_USER}>`,
  },
);

exports.sendInviteEmail = onDocumentCreated(
  {
    document: 'accountInvites/{inviteCode}',
    region: 'us-central1',
  },
  async event => {
    const data = event.data?.data();
    if (!data) {
      logger.warn('📭 No data found in the document snapshot.');
      return;
    }

    const recipientEmail = data.email;
    const inviterName = `${data.fromFirst} ${data.fromLast}`;

    const mailOptions = {
      from: `Kitchen Queue <${EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'You’ve been invited to join a Kitchen Queue account',
      text: `
Hello!

${inviterName} has invited you to join their Kitchen Queue account.

To get started, download the app, create a user/profile. After verification, log in and select "Join an Account" and use the 6-digit code below:

Invite Code: ${data.inviteCode}

This code will expire after 7 days.

Thanks,  
The Kitchen Queue Team
      `.trim(),
      bounce: 'errors@kitchen-queue.com',
    };

    // 👇 Add DNS lookup test BEFORE sending mail
    dns.lookup('mail.kitchen-queue.com', (err, address) => {
      if (err) {
        logger.error('❌ DNS Lookup failed:', err);
      } else {
        logger.info(`✅ DNS Lookup succeeded: ${address}`);
      }
    });

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`✉️ Email successfully sent to ${recipientEmail}`);
    } catch (error) {
      logger.error('❌ Failed to send invite email:', error);
    }
  },
);
