import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { api } from "@/lib/api";
import { tx } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function JeeviChat() {
  const { selectedLanguage } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, I am Jeevi. Ask me about vaccine timing, feeding, common symptoms, or growth milestones.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { reply } = await api.chat({
        message: userMessage.content,
        history: messages,
        language: selectedLanguage,
      });
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Jeevi AI could not respond");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse text-right" : ""}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <p
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground"
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}
        {loading ? <p className="text-sm text-muted-foreground">{tx("Jeevi is typing…", selectedLanguage)}</p> : null}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tx("Ask Jeevi a question…", selectedLanguage)}
          className="flex-1 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
