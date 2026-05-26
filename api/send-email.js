// api/send-email.js
import nodemailer from "nodemailer";
import { withErrorHandling } from "./utils/errorWrapper.js";

const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: emailPass,
  },
});

// Verify transporter so deployment issues surface quickly
transporter.verify().then(
  () => console.log("📧 api/send-email: Nodemailer transporter successfully verified"),
  (err) => console.warn("📧 api/send-email: Nodemailer transporter verification failed:", err && err.message ? err.message : err)
);

export default withErrorHandling(async (req, res, { ValidationError, ServiceUnavailableError, logger, EMAIL_REGEX, sanitizeInput }) => {
  const { name, email, question, message } = req.body || {};

  // 1. Check for missing required fields
  const errors = {};
  if (!name) errors.name = "Name field is required.";
  if (!email) errors.email = "Email field is required.";
  if (!question) errors.question = "Question/Subject topic is required.";
  if (!message) errors.message = "Message content is required.";

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors, "Missing required fields");
  }

  // 2. Validate formats & types
  if (typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    errors.email = "Please provide a valid email address.";
  }
  if (typeof question !== "string" || question.trim().length < 3) {
    errors.question = "Question subject must be at least 3 characters long.";
  }
  if (typeof message !== "string" || message.trim().length < 5) {
    errors.message = "Message must be at least 5 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors, "Invalid request payload values");
  }

  // 3. Sanitize inputs to prevent XSS
  const cleanName = sanitizeInput(name);
  const cleanEmail = sanitizeInput(email);
  const cleanQuestion = sanitizeInput(question);
  const cleanMessage = sanitizeInput(message);

  if (!process.env.EMAIL_USER) {
    throw new ServiceUnavailableError("Server email sender configuration is missing.");
  }

  // Send to Aditi
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${cleanQuestion}`,
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>From:</strong> ${cleanName} (${cleanEmail})</p>
        <p><strong>Question:</strong> ${cleanQuestion}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage.replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (err) {
    logger.error("Failed sending message notification to administrator email in serverless function", err);
    throw new ServiceUnavailableError("Failed to deliver your email message. Please try again later.");
  }

  // Send confirmation to visitor
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "I received your message! 🚀",
      html: `
        <h2>Thanks for reaching out, ${cleanName}!</h2>
        <p>I've received your message about <strong>"${cleanQuestion}"</strong> and will get back to you soon.</p>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">
          In the meantime, feel free to check out my portfolio at <a href="https://aditi-nigam.vercel.app">aditi-nigam.vercel.app</a>
        </p>
      `,
    });
  } catch (err) {
    logger.warn(`Failed sending visitor auto-reply confirmation email inside serverless function to ${cleanEmail}`, err);
  }

  res.json({ success: true, message: "Email sent successfully!" });
});
