# The Aditi's Portfolio

A cinematic, futuristic portfolio for **Aditi Nigam** — immersive AI universe experience with holographic UI, Jerry AI assistant, real portfolio content, **email notifications**, and AI-powered responses.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gmail account with [app password](https://support.google.com/accounts/answer/185833)
- [Groq API key](https://console.groq.com/keys) (free tier available)

### Setup

1. **Clone & install:**
   ```bash
   npm install
   ```

2. **Configure `.env`** (copy from `.env.example`):
   ```env
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=your_app_password
   GROQ_API_KEY=your_groq_key
   ```

3. **Run locally** (2 terminals):
   ```bash
   # Terminal 1: Backend server
   node --loader ts-node/esm server.ts

   # Terminal 2: Frontend dev server
   npm run dev
   ```

   Or use one command:
   ```bash
   npm run dev:all
   ```

Open `http://localhost:5173` in your browser.

## 📋 Features

- ✨ **Cinematic hero** with holographic AI face (SVG + CSS animations)
- 🤖 **Jerry** — AI guide powered by Groq (answers about you + local knowledge)
- 📧 **Email form** — Sends messages to you with auto-reply to visitors
- 🌌 **Skills Galaxy, AI Lab, Mission Control** — Interactive sections
- 🎯 **Mobile-optimized** with adaptive particles & reduced motion support
- 📄 **Resume** available at `/resume/ADITI_NIGAM_CV.pdf`

## 📚 Documentation

See [SETUP.md](./SETUP.md) for:
- Detailed setup instructions
- Email & Groq configuration
- Troubleshooting guide
- Deployment instructions

## 🔨 Build

```bash
npm run build
npm run preview
```

## 🚀 Deploy

**Frontend:** Deploy the `dist` folder to Vercel, Netlify, or any static host.

**Backend:** Deploy `server.ts` to Render, Railway, or similar cloud service. Update `VITE_API_URL` in production environment to point to your backend.

**Resume:** `/resume/ADITI_NIGAM_CV.pdf` is served from the public folder.

See [SETUP.md](./SETUP.md) deployment section for detailed instructions.
