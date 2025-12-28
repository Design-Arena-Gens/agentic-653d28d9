"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import type { AgentMessage, AgentProfile } from "@/lib/agent";
import { ChatMessage } from "./chat-message";

interface AgentConsoleProps {
  profile: AgentProfile;
}

type ChatEntry = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  pending?: boolean;
};

const SUGGESTED_PROMPTS = [
  "Craft a LinkedIn pitch for an importer in Dubai asking for MOQ 500 units.",
  "Plan a follow-up email for a German buyer focusing on certifications.",
  "Help me structure an export quotation for CIF Singapore with 20% margin.",
];

const INITIAL_GREETING =
  "Namaste! Main aapka export sales agent hoon. Product details share karein, main buyers ke liye pitch, pricing aur follow-up plan ready karunga.";

export const AgentConsole = memo(function AgentConsole({
  profile,
}: AgentConsoleProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatEntry[]>([
    createChatEntry("agent", INITIAL_GREETING),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setIsLoading(true);

      const userEntry = createChatEntry("user", trimmed);
      const placeholder = createChatEntry("agent", "Typing…", true);

      setMessages((prev) => [...prev, userEntry, placeholder]);

      try {
        const history = prevToAgentMessages([...messages, userEntry]);
        const payload = {
          messages: buildAgentHistory(history),
          profile,
        };

        const response = await fetch("/api/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data?.success) {
          throw new Error("Failed to generate response");
        }

        const agentReply = createChatEntry(
          "agent",
          data.message as string,
        );

        setMessages((prev) => {
          const next = [...prev];
          next.splice(next.length - 1, 1, agentReply);
          return next;
        });
      } catch (error) {
        console.error("Agent request failed:", error);
        setMessages((prev) => {
          const next = [...prev];
          next.splice(
            next.length - 1,
            1,
            createChatEntry(
              "agent",
              "I'm unable to generate guidance right now. Please retry after a moment.",
            ),
          );
          return next;
        });
      } finally {
        setInput("");
        setIsLoading(false);
      }
    },
    [isLoading, messages, profile],
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend(input);
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-600/90 via-indigo-600/70 to-purple-600/70 p-6 text-white shadow-xl shadow-indigo-900/30 backdrop-blur">
      <header className="flex flex-col gap-2 border-b border-white/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lg font-semibold uppercase">
            AI
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-wide">
              Export Deal Agent
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Bharat Export Sales Copilot
            </p>
          </div>
        </div>
        <div className="text-xs text-white/80">
          Product: {profile.product || "Not set"} · Markets:{" "}
          {profile.targetMarkets && profile.targetMarkets.length > 0
            ? profile.targetMarkets.join(" / ")
            : "Global"}
        </div>
      </header>

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            isPending={message.pending}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <footer className="mt-4 space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Quick Prompts
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void handleSend(prompt)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/90 transition hover:border-white/40 hover:bg-white/20"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/15 px-4 py-3"
        >
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Buyer ne kya poocha? Type here in English/Hindi…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-indigo-200"
            disabled={isLoading || input.trim().length === 0}
          >
            {isLoading ? "Processing…" : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
});

function createChatEntry(
  role: "user" | "agent",
  content: string,
  pending = false,
): ChatEntry {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    pending,
    timestamp: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function buildAgentHistory(messages: AgentMessage[]) {
  return messages.slice(-10);
}

function prevToAgentMessages(messages: ChatEntry[]) {
  return messages.map<AgentMessage>((message) => ({
    role: message.role,
    content: message.content,
  }));
}
