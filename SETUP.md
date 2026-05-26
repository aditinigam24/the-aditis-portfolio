<!-- SETUP.md -->
# 🚀 Setup Guide - Email & Jerry Chatbot Integration

Your portfolio now has **email notifications** and an **AI chatbot** (Jerry) powered by Groq. Here's what's been set up and what you need to do.

## ✅ Already Configured

- ✨ **Backend server** (`server.ts`) - Handles email & AI
- 📧 **Contact form API** - Sends emails via Gmail
- 🤖 **Jerry API** - Integrates Groq LLM
- 🎯 **Frontend components** - Updated to call APIs
- ⚙️ **Environment variables** - Pre-configured in `.env`

---

## 📋 Prerequisites

### 1. **Gmail App Password** (for email sending)
You already have this in `.env` as `EMAIL_PASS`. If you need a new one:

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Find "App passwords" → Create one for "Mail" on "Windows Computer"
4. Copy the 16-character password and paste into `.env` → `EMAIL_PASS`

✅ **Status:** You have this! (`jywq rioj anss goar`)

---

### 2. **Groq API Key** (for Jerry AI responses)
You already have this in `.env` as `GROQ_API_KEY`. If you need a new one:

1. Visit [console.groq.com/keys](https://console.groq.com/keys)
2. Create an API key
3. Paste it into `.env` → `GROQ_API_KEY`

✅ **Status:** Set your Groq API key in `.env` file

---

## 🛠️ Installation & Running

### Step 1: Install Dependencies
```bash
npm install
```

This installs required packages including:
- `express` - Backend server
- `nodemailer` - Email sending
- `cors` - Allow frontend to call backend

### Step 2: Run Both Server & Frontend

**Option A: Two separate terminals**
```bash
# Terminal 1 - Backend server
node --loader ts-node/esm server.ts

# Terminal 2 - Frontend dev server
npm run dev
```

**Option B: One command (if you install concurrently)**
```bash
npm install concurrently --save-dev
npm run dev:all
```

### Step 3: Test It!

1. Open [https://the-aditis-portfolio.onrender.com](https://the-aditis-portfolio.onrender.com) (or the Vite port shown)
2. **Test Email:**
   - Scroll to "Communication Terminal"
   - Fill the form and submit
   - Check your inbox at `aditinigam225@gmail.com`
   - Visitor gets a confirmation email
3. **Test Jerry:**
   - Click the "Jerry" button (bottom-right)
   - Ask a question about you (e.g., "What projects has Aditi built?")
   - Should get responses from local knowledge base or Groq API

---

## 📊 How It Works

### Contact Form Flow
```
User fills form
      ↓
Submits to POST /api/send-email
      ↓
Backend validates & sends via Gmail SMTP
      ↓
Email to: aditinigam225@gmail.com ✉️
Confirmation to: visitor@email.com ✉️
      ↓
Frontend shows success message
```

### Jerry Chatbot Flow
```
User types question
      ↓
Submits to POST /api/jerry
      ↓
Backend searches local knowledge base
      ↓
If found: Return local answer ⚡
If not found: Call Groq API 🤖
      ↓
Response streamed to frontend
      ↓
Jerry displays answer with typewriter effect
```

---

## 🔧 Customization

### Update Jerry's Knowledge Base
Edit [src/data/jerry.ts](../src/data/jerry.ts):
- `jerryIntro` - Welcome message
- `jerrySuggestions` - Suggested questions
- `jerrySuggestions` - Q&A topics (keywords + answers)

### Change Email Sender
In `.env`, update `EMAIL_USER` to any Gmail account with app password.

### Change Groq Model
In `.env`, update `GROQ_MODEL`:
- `llama-3.3-70b-versatile` (default, fast)
- `mixtral-8x7b-32768` (alternative)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | ❌ Email credentials wrong? Check `.env` EMAIL_USER & EMAIL_PASS |
| Email fails | ❌ Less secure apps blocked? Use [app password instead](https://support.google.com/accounts/answer/185833) |
| Jerry not responding | ❌ Groq API key invalid? Check `.env` GROQ_API_KEY |
| "Connection refused" | ❌ Backend not running? Start with `node --loader ts-node/esm server.ts` |
| Frontend can't reach backend | ❌ Check `VITE_API_URL` in `.env` matches your backend port |

---

## 🚀 Deployment

When deploying (e.g., Vercel + cloud backend):

1. **Backend:** Deploy `server.ts` to Render, Railway, or similar
2. **Frontend:** Deploy to Vercel as usual
3. **Update `.env.production`:**
   ```env
   VITE_API_URL=https://your-backend.com
   ```

For example:
- Frontend: `aditi-nigam.vercel.app`
- Backend: `aditi-backend.render.com`
- Frontend → calls → `https://aditi-backend.render.com/api/...`

---

## 📞 Support

Need help? Check:
- Server terminal for errors (usually clear error messages)
- Browser console (F12) for frontend errors
- `.env` file has all required credentials
- Gmail & Groq accounts are active

Happy building! 🎉
