// api/send-email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : process.env.EMAIL_PASS,
  },
});

// Verify transporter so deployment issues surface quickly
transporter.verify().then(
  () => console.log("📧 api/send-email: transporter verified"),
  (err) => console.warn("📧 api/send-email: transporter verification failed:", err && err.message ? err.message : err)
);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { name, email, question, message } = req.body || {};
    if (!name || !email || !question || !message) return res.status(400).json({ error: "Missing required fields" });

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: process.env.EMAIL_USER, subject: `Portfolio Contact: ${question}`, html: `<h2>New Message</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Question:</strong> ${question}</p><p>${message.replace(/\n/g, "<br>")}</p>` });

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: "I received your message! 🚀", html: `<h2>Thanks for reaching out, ${name}!</h2><p>I've received your message about <strong>"${question}"</strong> and will get back to you soon.</p>` });

    res.json({ success: true });
  } catch (error) {
    console.error("send-email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
