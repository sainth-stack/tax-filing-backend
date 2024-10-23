import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the SMTP transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // True for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, body) => {
  console.log(to);
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to, // Recipient's email address
    subject, // Email subject
    text: body, // Plain text body
    html: `${body.replace(/\n/g, "<br>")}`, // HTML body with line breaks
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export default sendEmail;
