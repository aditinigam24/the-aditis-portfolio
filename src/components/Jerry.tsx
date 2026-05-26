import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jerryIntro, jerrySuggestions } from "../data/jerry";
import { typewriterDelay } from "../lib/jerryBrain";
import jerryFace from "../assets/jerry.png";

type Msg = { id: string; role: "user" | "assistant"; text: string };

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function Jerry() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "intro", role: "assistant", text: jerryIntro },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("jerry:open", onOpen);
    return () => window.removeEventListener("jerry:open", onOpen);
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Msg = { id: id(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for Render spin-up

    try {
      await typewriterDelay(trimmed);
      
      // Call the server endpoint for AI-powered response
      const apiUrl = import.meta.env.VITE_API_URL || "https://the-aditis-portfolio.onrender.com";
      const response = await fetch(`${apiUrl}/api/jerry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Detailed logging for debugging deployment issues
      console.log("/api/jerry request URL:", `${apiUrl}/api/jerry`);
      console.log("/api/jerry response status:", response.status, response.statusText);

      if (!response.ok) {
        const text = await response.text();
        console.error("/api/jerry non-ok response body:", text);
        throw new Error(`Failed to get response: ${response.status} ${response.statusText} - ${text}`);
      }

      const data = await response.json();
      console.log("/api/jerry response data:", data);
      const reply = data.reply || "Sorry, I couldn't generate a response. Please try again.";
      
      setMessages((m) => [...m, { id: id(), role: "assistant", text: reply }]);
    } catch (error: any) {
      console.error("Jerry error:", error);
      const errorText = error.name === "AbortError" 
        ? "😅 *panting* Whoa — Jerry's spinning up the servers! I'm fast, but even I need a few seconds. Try again in a moment! 🐭⚡"
        : "😬 *slips on banana peel* Oops — something went wrong on my end! Try again and I'll dart right back with an answer!"
      setMessages((m) => [
        ...m,
        {
          id: id(),
          role: "assistant",
          text: errorText,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-cyan-500/40 bg-slate-950/80 backdrop-blur-md p-1.5 pr-4.5 text-sm font-semibold text-white shadow-[0_0_40px_-5px_rgba(34,211,238,0.4)] transition-all duration-300 hover:border-cyan-400/80 hover:shadow-[0_0_50px_0_rgba(34,211,238,0.6)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Chat with Jerry"
      >
        <div className="relative flex">
          <img
            src={jerryFace}
            alt="Jerry"
            className="h-10 w-10 object-contain"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border border-slate-950 shadow-[0_0_8px_#4ade80] animate-pulse" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="font-display text-[11px] tracking-wider text-cyan-300">JERRY AI</span>
          <span className="text-[9px] text-slate-400 font-sans font-light">Always one step ahead 🐭</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-label="Close"
            />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="glass-strong holo-border relative flex h-[min(85vh,560px)] w-full max-w-md flex-col overflow-hidden rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex">
                    <img
                      src={jerryFace}
                      alt="Jerry AI"
                      className="h-10 w-10 object-contain"
                    />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border border-slate-950 shadow-[0_0_8px_#4ade80] animate-pulse" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-slate-100 leading-tight">
                      Jerry
                    </p>
                    <p className="text-[10px] text-cyan-400/80">Always one step ahead 🐭⚡</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 space-y-4 overflow-y-auto p-4"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 items-start ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.role === "assistant" && (
                      <div className="relative shrink-0 flex">
                        <img
                          src={jerryFace}
                          alt="Jerry"
                          className="h-8 w-8 object-contain"
                        />
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 border border-slate-950 shadow-[0_0_6px_#4ade80]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed transition-all duration-300 ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 text-white rounded-tr-none shadow-[0_4px_15px_rgba(79,70,229,0.25)]"
                          : "border border-cyan-500/20 bg-slate-900/60 backdrop-blur-sm text-slate-200 rounded-tl-none shadow-[0_4px_20px_-5px_rgba(34,211,238,0.2)] hover:border-cyan-400/40"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-3 items-center text-xs text-cyan-400/80">
                    <div className="relative shrink-0 flex">
                      <img
                        src={jerryFace}
                        alt="Jerry"
                        className="h-8 w-8 object-contain animate-pulse"
                      />
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-cyan-400 border border-slate-950 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl border border-cyan-500/10 bg-slate-900/40 px-3.5 py-2.5 shadow-[0_4px_15px_-3px_rgba(34,211,238,0.15)]">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  {jerrySuggestions.slice(0, 3).map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-cyan-500/20 bg-cyan-500/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/[0.08] hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Aditi…"
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm outline-none focus:border-cyan-500/40 text-slate-100 placeholder-slate-500 transition-colors focus:bg-white/[0.06]"
                  />
                  <motion.button
                    type="submit"
                    disabled={typing || !input.trim()}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white shadow-[0_0_15px_-3px_rgba(34,211,238,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_0_rgba(34,211,238,0.7)] disabled:pointer-events-none disabled:opacity-30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
