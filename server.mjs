import 'dotenv/config';
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

// Jerry topics data
const jerryTopics = [
  {
    keywords: ["who", "about", "introduce", "aditi", "background"],
    answer:
      "Aditi Nigam is a Full Stack Developer and Generative AI explorer — a B.Tech Computer Science student, entrepreneur, and community leader. She builds design-led, impactful digital products and is open to internships and collaborations in 2026.",
  },
  {
    keywords: ["skill", "stack", "tech", "tool", "language", "framework"],
    answer:
      "Her toolkit includes React, Next.js, TypeScript, Node.js, Express, MySQL, Tailwind, REST APIs, Python, and Generative AI (LLMs & agents). She ships from database to pixel with strong UI/UX thinking.",
  },
  {
    keywords: ["experience", "intern", "job", "work", "career", "ey", "isoftzone"],
    answer:
      "Highlights: Generative AI Intern at EY (2026), Full Stack Developer Intern at i-SoftZone (2025) on a live CRM, Marketing Associate at Codec Club SUAS, Academics Head on Student Council, and Founder of Adore Hive Jewellery.",
  },
  {
    keywords: ["project", "portfolio", "built", "crm", "narishakti", "app"],
    answer:
      "Selected work: Real Estate CRM (React, Node, MySQL), NariShakti women-safety platform, a university field survey app, and premium dashboard UI studies with Next.js and Framer Motion.",
  },
  {
    keywords: ["leadership", "community", "network", "founder", "entrepreneur"],
    answer:
      "Aditi leads through community and craft: 1.5K+ LinkedIn network, founder of Adore Hive Jewellery, and active roles in campus tech and student leadership — combining engineering with storytelling and impact.",
  },
  {
    keywords: ["ai", "gen ai", "llm", "generative", "machine"],
    answer:
      "She's exploring LLMs, AI workflows, and intelligent systems — currently as a Gen AI Intern at EY, with a passion for AI-powered products at both startup and enterprise scale.",
  },
  {
    keywords: ["contact", "email", "reach", "hire", "collaborate", "message"],
    answer:
      "Reach her at aditinigam225@gmail.com or on LinkedIn (aditi-nigam). Use the contact form on this site for internships, collaborations, or questions about AI and full stack work — she'll get back to you.",
  },
  {
    keywords: ["resume", "cv", "download", "pdf"],
    answer:
      "You can view or download Aditi's resume from the Resume button in the hero section or the Resume link in the navigation bar — it opens her PDF.",
  },
  {
    keywords: ["education", "student", "degree", "b.tech", "college", "university"],
    answer:
      "She's pursuing B.Tech in Computer Science, channeling curiosity into systems, design, and intelligent products while balancing internships and entrepreneurial work.",
  },
  {
    keywords: ["design", "ui", "ux", "aesthetic", "visual"],
    answer:
      "Aditi cares deeply about UI/UX — her portfolio and projects emphasize motion, clarity, and cinematic aesthetics. She treats design as a discipline, not an afterthought.",
  },
  {
    keywords: ["hello", "hi", "hey", "jerry"],
    answer:
      "Hey there! I'm Jerry. I can tell you about Aditi's background, skills, experience, projects, and how to connect. What would you like to know?",
  },
];

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? false : "*",
  })
);

// ============ EMAIL SETUP ============
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : process.env.EMAIL_PASS,
  },
});

// Verify transporter connection at startup to surface config issues early
transporter.verify().then(
  () => console.log("📧 Nodemailer transporter verified"),
  (err) => console.warn("📧 Nodemailer transporter verification failed:", err && err.message ? err.message : err)
);

// ============ EMAIL ENDPOINT ============
app.post("/api/send-email", async (req, res) => {
  try {
    const { name, email, question, message } = req.body;

    if (!name || !email || !question || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Send to Aditi
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${question}`,
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Question:</strong> ${question}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Send confirmation to visitor
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "I received your message! 🚀",
      html: `
        <h2>Thanks for reaching out, ${name}!</h2>
        <p>I've received your message about <strong>"${question}"</strong> and will get back to you soon.</p>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">
          In the meantime, feel free to check out my portfolio at <a href="https://aditi-nigam.vercel.app">aditi-nigam.vercel.app</a>
        </p>
      `,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
});

// ============ GROQ API ENDPOINT ============
app.post("/api/jerry", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use Groq AI as primary answer engine
    if (!process.env.GROQ_API_KEY) {
      console.warn("Groq API key not configured, falling back to local knowledge");
      const localReply = getJerryReply(message);
      return res.json({ reply: localReply, source: "local" });
    }

    try {
      const groqReply = await getGroqReply(message);
      return res.json({ reply: groqReply, source: "groq" });
    } catch (error) {
      console.warn("Groq API failed, falling back to local knowledge:", error);
      const localReply = getJerryReply(message);
      return res.json({ reply: localReply, source: "local-fallback" });
    }
  } catch (error) {
    console.error("Jerry error:", error);
    res
      .status(500)
      .json({ error: "Failed to get response. Please try again." });
  }
});

// ============ LOCAL JERRY BRAIN ============
function getJerryReply(message) {
  const lower = message.toLowerCase().trim();
  if (!lower) {
    return "I'm not sure about that one — try asking about Aditi's skills, experience, projects, achievements, AI work, or how to contact her.";
  }

  let best = null;

  for (const topic of jerryTopics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: topic.answer };
    }
  }

  return (
    best?.answer ??
    "I'm not sure about that one — try asking about Aditi's skills, experience, projects, achievements, AI work, or how to contact her."
  );
}

// ============ GROQ API INTEGRATION ============
async function getGroqReply(userMessage) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are Jerry, a warm and intelligent AI assistant on Aditi Nigam's portfolio. Your role is to answer ANY question about Aditi, her work, skills, projects, and career.

ABOUT ADITI NIGAM:
- Full Stack Developer & Generative AI Explorer
- B.Tech in Computer Science student
- Skills: React, Next.js, TypeScript, Node.js, Express, MySQL, Tailwind, REST APIs, Python, Generative AI (LLMs & agents)
- Current: Gen AI Intern at EY (2026), Full Stack Developer Intern at i-SoftZone (2025)
- Previous: Marketing Associate at Codec Club SUAS, Academics Head on Student Council
- Founder: Adore Hive Jewellery
- LinkedIn: linkedin.com/in/aditi-nigam-001b8431a (1.5K+ network)
- Email: aditinigam225@gmail.com

EXPERIENCE:
- Real Estate CRM (React, Node.js, MySQL)
- NariShakti women-safety platform
- University field survey app
- Premium dashboard UI studies with Next.js and Framer Motion
- Generative AI exploration at EY
- Building design-led, impactful digital products

QUALITIES:
- Passionate about UI/UX design and motion
- Emphasizes clarity, cinematic aesthetics, and user-centered design
- Combines engineering with storytelling and community impact
- Open to internships and collaborations in 2026

INSTRUCTIONS:
1. Answer questions directly and comprehensively about Aditi
2. Be warm, friendly, and professional
3. Keep responses 2-4 sentences unless asked for details
4. Only discuss topics related to Aditi - if asked unrelated questions, politely redirect
5. Never invent projects, credentials, or experience not listed above
6. For technical questions about her work, provide informed insights based on her expertise
7. When unsure, suggest contacting her at aditinigam225@gmail.com or via the contact form
8. Be honest and maintain Aditi's professional integrity`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response. Please try again."
    );
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

// ============ HEALTH CHECK ============
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    emailConfigured: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS,
    groqConfigured: !!process.env.GROQ_API_KEY,
  });
});

// ============ START SERVER ============
const PORT = parseInt(process.env.SERVER_PORT || "3001", 10);
app.listen(PORT, () => {
  console.log(`✨ Server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured: ${!!process.env.EMAIL_USER}`);
  console.log(`🤖 Groq API configured: ${!!process.env.GROQ_API_KEY}`);
});
