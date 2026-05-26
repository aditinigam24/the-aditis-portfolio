// server.mjs
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (fs.existsSync(path.resolve("src/.env"))) {
  dotenv.config({ path: path.resolve("src/.env") });
} else {
  dotenv.config();
}
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { AppError, BadRequestError, ValidationError, NotFoundError, ServiceUnavailableError } from "./errors.mjs";
import { logger } from "./logger.mjs";

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

// ============ INCOMING BODY PARSER & SECURITY MIDDLEWARES ============
app.use(express.json());

// JSON parsing error handler - must be added immediately after express.json()
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    logger.warn(`Malformed JSON received from ${req.ip} on ${req.method} ${req.path}`);
    return res.status(400).json({
      status: "fail",
      message: "Malformed JSON payload: please check your syntax structure.",
    });
  }
  next(err);
});

const allowedOrigins = [
  "https://the-aditi-nigam.vercel.app",
  process.env.FRONTEND_URL || ""
].filter(Boolean);

app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? allowedOrigins
      : "*",
  })
);

// Input validation and sanitization helpers
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // strip script tags
    .replace(/<[^>]*>/g, "") // strip other HTML tags
    .trim();
}

// ============ EMAIL SETUP ============
const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: emailPass,
  },
});

// Verify transporter connection at startup
transporter.verify().then(
  () => logger.info("Nodemailer SMTP transporter verified and ready to transmit"),
  (err) => logger.warn("Nodemailer SMTP verification failed. Check EMAIL_USER/EMAIL_PASS credentials:", err)
);

// ============ EMAIL ENDPOINT ============
app.post("/api/send-email", async (req, res, next) => {
  try {
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

    // 3. Sanitize inputs to prevent XSS/Injection
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanQuestion = sanitizeInput(question);
    const cleanMessage = sanitizeInput(message);

    // Ensure EMAIL_USER environment variable is configured
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
      logger.error("Failed sending message notification to administrator email", err);
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
      // Non-blocking log if auto-reply receipt fails
      logger.warn(`Failed sending visitor auto-reply confirmation email to ${cleanEmail}`, err);
    }

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    next(error);
  }
});

// ============ GROQ API ENDPOINT ============
app.post("/api/jerry", async (req, res, next) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new BadRequestError("Message field is required and must be a valid non-empty string.");
    }

    const cleanMessage = sanitizeInput(message);

    // Use Groq AI as primary answer engine
    if (!process.env.GROQ_API_KEY) {
      logger.warn("Groq API key not configured in environment, falling back to local database engine");
      const localReply = getJerryReply(cleanMessage);
      return res.json({ reply: localReply, source: "local" });
    }

    try {
      const groqReply = await getGroqReply(cleanMessage);
      return res.json({ reply: groqReply, source: "groq" });
    } catch (error) {
      logger.warn("Groq API service encountered an error; falling back to local database engine", error);
      const localReply = getJerryReply(cleanMessage);
      return res.json({ reply: localReply, source: "local-fallback" });
    }
  } catch (error) {
    next(error);
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
- Emphasizes cinematic aesthetics, motion, and clarity
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
      throw new Error(`Groq API returned HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    return (
      data.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response. Please try again."
    );
  } catch (error) {
    logger.error("Groq API Integration network failure", error);
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

// ============ 404 ROUTE CATCH-ALL ============
app.all("/*splat", (req, res, next) => {
  next(new NotFoundError(`Requested path '${req.method} ${req.originalUrl}' is not registered on this server.`));
});

// ============ GLOBAL ERROR MIDDLEWARE ============
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Intercept bad JSON syntax parsing error from express.json()
  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    logger.warn(`Malformed JSON body payload submitted from ${req.ip} on ${req.method} ${req.path}`);
    return res.status(400).json({
      status: "fail",
      message: "Malformed JSON payload: please check your syntax structure.",
    });
  }

  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "An unexpected system error occurred.";
  let errors = err.errors || undefined;

  // Differentiate operational errors from unhandled programmer bugs
  if (err.isOperational) {
    logger.warn(`${err.constructor.name}: ${message} [${req.method} ${req.path}]`, {
      ip: req.ip,
      body: req.body,
      errors,
    });
  } else {
    logger.critical(`Unhandled System Exception: ${err.message} [${req.method} ${req.path}]`, err);
    // Sanitize production server responses
    if (process.env.NODE_ENV === "production") {
      statusCode = 500;
      status = "error";
      message = "An internal server error occurred.";
    }
  }

  const responsePayload = {
    status,
    message,
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  if (process.env.NODE_ENV !== "production") {
    responsePayload.error = {
      name: err.name,
      message: err.message,
    };
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
});

// ============ START SERVER ============
const PORT = parseInt(process.env.SERVER_PORT || "3001", 10);
const server = app.listen(PORT, () => {
  logger.info(`Server successfully launched on port ${PORT}`);
  logger.info(`Server production target URL configured as: https://the-aditis-portfolio.onrender.com`);
  logger.info(`Environment services Status -> Email service: ${!!process.env.EMAIL_USER ? "ONLINE" : "OFFLINE"}, Groq AI: ${!!process.env.GROQ_API_KEY ? "ONLINE" : "OFFLINE"}`);
});

// ============ UNHANDLED REJECTIONS AND EXCEPTIONS PROTECTION ============
process.on("uncaughtException", (error) => {
  logger.critical("CRITICAL: Uncaught Exception detected in active loop. Initiating graceful crash shutdown procedure...", error);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  logger.critical("CRITICAL: Unhandled Promise Rejection detected. Initiating graceful crash shutdown procedure...", reason);
  gracefulShutdown();
});

// ============ GRACEFUL SHUTDOWN HANDLER ============
let isShuttingDown = false;
function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  if (signal) {
    logger.info(`Received process signal ${signal}. Starting graceful application termination...`);
  }
  
  // Give current active transactions 10s to settle before force terminating
  const timeoutId = setTimeout(() => {
    logger.warn("Shutdown timeout reached. Force-terminating process execution.");
    process.exit(1);
  }, 10000);

  server.close(() => {
    clearTimeout(timeoutId);
    logger.info("Express server shutdown complete. Safe to exit.");
    process.exit(0);
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
