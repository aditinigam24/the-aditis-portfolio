// api/jerry.js
const jerryTopics = [
  { keywords: ["who", "about", "introduce", "aditi", "background"], answer: "Aditi Nigam is a Full Stack Developer and Generative AI explorer — a B.Tech Computer Science student, entrepreneur, and community leader. She builds design-led, impactful digital products and is open to internships and collaborations in 2026." },
  { keywords: ["skill", "stack", "tech", "tool", "language", "framework"], answer: "Her toolkit includes React, Next.js, TypeScript, Node.js, Express, MySQL, Tailwind, REST APIs, Python, and Generative AI (LLMs & agents). She ships from database to pixel with strong UI/UX thinking." },
  { keywords: ["experience", "intern", "job", "work", "career", "ey", "isoftzone"], answer: "Highlights: Generative AI Intern at EY (2026), Full Stack Developer Intern at i-SoftZone (2025) on a live CRM, Marketing Associate at Codec Club SUAS, Academics Head on Student Council, and Founder of Adore Hive Jewellery." },
  { keywords: ["project", "portfolio", "built", "crm", "narishakti", "app"], answer: "Selected work: Real Estate CRM (React, Node, MySQL), NariShakti women-safety platform, a university field survey app, and premium dashboard UI studies with Next.js and Framer Motion." },
  { keywords: ["leadership", "community", "network", "founder", "entrepreneur"], answer: "Aditi leads through community and craft: 1.5K+ LinkedIn network, founder of Adore Hive Jewellery, and active roles in campus tech and student leadership — combining engineering with storytelling and impact." },
  { keywords: ["ai", "gen ai", "llm", "generative", "machine"], answer: "She's exploring LLMs, AI workflows, and intelligent systems — currently as a Gen AI Intern at EY, with a passion for AI-powered products at both startup and enterprise scale." },
  { keywords: ["contact", "email", "reach", "hire", "collaborate", "message"], answer: "Reach her at aditinigam225@gmail.com or on LinkedIn (aditi-nigam). Use the contact form on this site for internships, collaborations, or questions about AI and full stack work — she'll get back to you." },
  { keywords: ["resume", "cv", "download", "pdf"], answer: "You can view or download Aditi's resume from the Resume button in the hero section or the Resume link in the navigation bar — it opens her PDF." },
  { keywords: ["education", "student", "degree", "b.tech", "college", "university"], answer: "She's pursuing B.Tech in Computer Science, channeling curiosity into systems, design, and intelligent products while balancing internships and entrepreneurial work." },
  { keywords: ["design", "ui", "ux", "aesthetic", "visual"], answer: "Aditi cares deeply about UI/UX — her portfolio and projects emphasize motion, clarity, and cinematic aesthetics. She treats design as a discipline, not an afterthought." },
  { keywords: ["hello", "hi", "hey", "jerry"], answer: "Hey there! I'm Jerry. I can tell you about Aditi's background, skills, experience, projects, and how to connect. What would you like to know?" },
];

function getJerryReply(message) {
  const lower = String(message || "").toLowerCase().trim();
  if (!lower) return "I'm not sure about that one — try asking about Aditi's skills, experience, projects, achievements, AI work, or how to contact her.";
  let best = null;
  for (const topic of jerryTopics) {
    let score = 0;
    for (const kw of topic.keywords) if (lower.includes(kw)) score += kw.length;
    if (score > 0 && (!best || score > best.score)) best = { score, answer: topic.answer };
  }
  return best?.answer || "I'm not sure about that one — try asking about Aditi's skills, experience, projects, achievements, AI work, or how to contact her.";
}

async function getGroqReply(userMessage) {
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", messages: [{ role: "system", content: "You are Jerry..." }, { role: "user", content: userMessage }], max_tokens: 300, temperature: 0.7 }),
  });
  if (!resp.ok) throw new Error(`Groq API error: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!process.env.GROQ_API_KEY) {
      const localReply = getJerryReply(message);
      return res.json({ reply: localReply, source: "local" });
    }
    try {
      const groqReply = await getGroqReply(message);
      return res.json({ reply: groqReply, source: "groq" });
    } catch (err) {
      console.warn("Groq failed", err);
      const localReply = getJerryReply(message);
      return res.json({ reply: localReply, source: "local-fallback" });
    }
  } catch (error) {
    console.error("Jerry function error:", error);
    res.status(500).json({ error: "Failed to get response" });
  }
};
