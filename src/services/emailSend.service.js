import nodemailer from 'nodemailer';

// Function to send verification email
async function sendVerificationEmail(email, code) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`
    };
  
    try {
      console.log(`Attempting to send verification email to ${email}`);
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email. Please try again.');
    }
  }
  
export default sendVerificationEmail;