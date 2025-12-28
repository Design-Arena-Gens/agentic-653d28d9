interface ChatMessageProps {
  role: "user" | "agent";
  content: string;
  timestamp?: string;
  isPending?: boolean;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  isPending = false,
}: ChatMessageProps) {
  const isAgent = role === "agent";
  return (
    <div
      className={`flex w-full gap-3 ${isAgent ? "justify-start" : "justify-end"}`}
    >
      {isAgent ? (
        <div className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-indigo-500/10 text-xs font-semibold uppercase text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-200">
          AI
        </div>
      ) : null}
      <div
        className={`max-w-xl rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-sm ${
          isAgent
            ? "border-indigo-200 bg-white text-slate-800 dark:border-indigo-500/20 dark:bg-stone-900 dark:text-slate-100"
            : "border-slate-200 bg-indigo-600 text-white shadow-indigo-300/40 dark:border-indigo-500/40 dark:bg-indigo-500"
        }`}
      >
        <div className="whitespace-pre-wrap">{isPending ? "Typing…" : content}</div>
        {timestamp ? (
          <span
            className={`mt-2 block text-[10px] uppercase tracking-widest ${
              isAgent ? "text-indigo-400" : "text-indigo-200"
            }`}
          >
            {timestamp}
          </span>
        ) : null}
      </div>
    </div>
  );
}
