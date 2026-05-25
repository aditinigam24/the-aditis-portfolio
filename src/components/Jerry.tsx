import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jerryIntro, jerrySuggestions } from "../data/jerry";
import { typewriterDelay } from "../lib/jerryBrain";

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

    try {
      await typewriterDelay(trimmed);
      
      // Call the server endpoint for AI-powered response
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/jerry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      
      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't generate a response. Please try again.";
      
      setMessages((m) => [...m, { id: id(), role: "assistant", text: reply }]);
    } catch (error) {
      console.error("Jerry error:", error);
      setMessages((m) => [
        ...m,
        {
          id: id(),
          role: "assistant",
          text: "Sorry, I encountered an error. Please try again!",
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-purple-500/40 bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.9)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Chat with Jerry"
      >
        <MessageCircle className="h-4 w-4" />
        Jerry
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
                  <div className="relative">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30">
                      <Bot className="h-5 w-5 text-cyan-300 animate-float" />
                    </div>
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-slate-100">
                      Jerry
                    </p>
                    <p className="text-[10px] text-cyan-400/80">AI Portfolio Guide</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto p-4"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white"
                          : "border border-cyan-500/20 bg-cyan-500/5 text-slate-300 shadow-[0_0_20px_-8px_rgba(34,211,238,0.4)]"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400/80">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    Jerry is thinking…
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-3">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {jerrySuggestions.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
                    >
                      {s}
                    </button>
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
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm outline-none focus:border-cyan-500/40"
                  />
                  <button
                    type="submit"
                    disabled={typing}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
