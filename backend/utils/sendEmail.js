const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Error verify transporter', error);
  } else {
    console.log('Verify transporter success', success);
  }
});

const sendVerificationEmail = async ({ _id, email, uniqueString }) => {
  const currentUrl = process.env.APP_URL;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `
      <p>Verify your email to complete signup.</p>
      <p>This link <b>expires in 6 hours</b>.</p>
      <p>Press <a href=${`${currentUrl}user/verify/${_id}/${uniqueString}`}>here</a> to proceed.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
};
