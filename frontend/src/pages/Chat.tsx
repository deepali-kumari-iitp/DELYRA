import { useRef, useState } from "react";
import {
  Bot,
  Paperclip,
  Send,
  Sparkles,
  Circle,
  ArrowDown,
  X,
  FileText,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import AgentActivity from "../components/chat/AgentActivity";

type Message = {
  role: "user" | "assistant";
  text: string;
};

function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [agentSteps, setAgentSteps] = useState<string[]>([]);
  const [agentCompleted, setAgentCompleted] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi Deepali ♡ I'm DELYRA. Tell me what you want to accomplish, and I'll help you plan and execute it.",
    },
  ]);

  // =========================
  // FILE SELECTION
  // =========================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    // Allows selecting the same file again later
    event.target.value = "";
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    setAgentSteps(["Understanding request"]);
    setAgentCompleted(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      if (data.plan?.steps) {
        setAgentSteps(data.plan.steps);
      }

      setAgentCompleted(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setAgentCompleted(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? `Error: ${error.message}`
              : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Plan my day",
    "Help me learn something",
    "Work on a project",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="pointer-events-none absolute inset-0 bg-[#e8e2d6]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.75),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(217,224,210,0.45),transparent_28%),radial-gradient(circle_at_55%_90%,rgba(231,185,177,0.22),transparent_30%)]" />

      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-white/30 blur-3xl" />

      <div className="pointer-events-none absolute right-[-100px] top-[45%] h-80 w-80 rounded-full bg-[#d9e0d2]/30 blur-3xl" />

      {/* =========================
          CONTENT
      ========================= */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#777467]">
                AI Workspace
              </span>

              <span className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/30 px-2.5 py-1 text-[9px] text-[#686c5a] backdrop-blur-xl">
                <Circle
                  size={6}
                  fill="currentColor"
                  className="text-[#8b9276]"
                />
                Online
              </span>
            </div>

            <h1 className="mt-2 font-['Playfair_Display'] text-4xl tracking-tight text-[#292820] sm:text-5xl">
              Let's get things done.
            </h1>

            <p className="mt-2 text-sm text-[#777467]">
              Think with DELYRA. Plan clearly. Execute better.
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="font-['Playfair_Display'] text-lg italic text-[#777467]">
              Your AI partner ♡
            </p>

            <p className="mt-1 text-[9px] tracking-[0.18em] text-[#999386]">
              THINK · PLAN · DO
            </p>
          </div>
        </div>

        {/* =========================
            CHAT AREA
        ========================= */}

        <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 p-4 shadow-[0_20px_60px_rgba(55,45,35,0.1)] backdrop-blur-2xl sm:p-6">

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e7b9b1]/15 blur-3xl" />

          <div className="relative">

            {/* =========================
                MESSAGES
            ========================= */}

            <div className="space-y-6">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* Assistant Avatar */}

                  {message.role === "assistant" && (
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-[#8b9276]/20 blur-md" />

                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-[#8b9276]/85 text-white shadow-[0_8px_20px_rgba(90,100,75,0.2)] backdrop-blur-xl">
                        <Bot size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}

                  <div
                    className={`max-w-[88%] rounded-[1.5rem] px-5 py-4 text-sm leading-7 shadow-sm sm:max-w-[78%] ${
                      message.role === "user"
                        ? "rounded-br-md border border-[#25251d] bg-[#292a21] text-white shadow-[0_10px_25px_rgba(40,35,25,0.15)]"
                        : "rounded-tl-md border border-white/60 bg-white/55 text-[#403e35] backdrop-blur-xl"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="mb-3 font-['Playfair_Display'] text-2xl text-[#292820]">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="mb-2 font-['Playfair_Display'] text-xl text-[#292820]">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="mb-2 text-lg font-semibold">
                            {children}
                          </h3>
                        ),

                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0">
                            {children}
                          </p>
                        ),

                        ul: ({ children }) => (
                          <ul className="mb-3 ml-5 list-disc space-y-1">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="mb-3 ml-5 list-decimal space-y-1">
                            {children}
                          </ol>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-semibold text-[#292820]">
                            {children}
                          </strong>
                        ),

                        code: ({ children }) => (
                          <code className="rounded-lg bg-[#eee9df] px-2 py-1 text-xs text-[#555247]">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* =========================
                  THINKING
              ========================= */}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-[#8b9276]/85 text-white shadow-md">
                    <Bot size={18} strokeWidth={1.5} />
                  </div>

                  <div className="flex items-center gap-3 rounded-[1.5rem] rounded-tl-md border border-white/60 bg-white/50 px-5 py-4 text-sm text-[#777467] backdrop-blur-xl">

                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8b9276]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8b9276] [animation-delay:120ms]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8b9276] [animation-delay:240ms]" />
                    </span>

                    DELYRA is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* =========================
                SUGGESTIONS
            ========================= */}

            {messages.length === 1 && (
              <div className="mt-8">

                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[#777467]">
                  Try asking DELYRA
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setInput(item)}
                      className="group rounded-2xl border border-white/60 bg-white/30 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/55 hover:shadow-md"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8dfd1]/70">
                        <Sparkles
                          size={15}
                          className="text-[#777467]"
                        />
                      </div>

                      <span className="mt-3 block text-sm text-[#403e35]">
                        {item}
                      </span>

                      <div className="mt-3 h-px w-5 bg-[#8b9276]/40 transition-all duration-300 group-hover:w-10" />
                    </button>
                  ))}

                </div>
              </div>
            )}

            {/* =========================
                AGENT ACTIVITY
            ========================= */}

            <div className="mt-8">
              <AgentActivity
                steps={agentSteps}
                completed={agentCompleted}
              />
            </div>

          </div>
        </div>

        {/* =========================
            INPUT AREA
        ========================= */}

        <div className="mt-5">

          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/50 p-3 shadow-[0_15px_45px_rgba(55,45,35,0.12)] backdrop-blur-2xl sm:p-4">

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e7b9b1]/15 blur-2xl" />

            <div className="relative">

              {/* =========================
                  SELECTED FILE
              ========================= */}

              {selectedFile && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/45 px-3 py-2.5 backdrop-blur-xl">

                  <div className="flex min-w-0 items-center gap-2.5">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8dfd1]/80 text-[#777467]">
                      <FileText size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#555247]">
                        {selectedFile.name}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#999386]">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    aria-label="Remove selected file"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#999386] transition hover:bg-white/70 hover:text-[#292820]"
                  >
                    <X size={15} />
                  </button>

                </div>
              )}

              {/* =========================
                  TEXTAREA
              ========================= */}

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Tell DELYRA what you need..."
                disabled={loading}
                className="min-h-20 w-full resize-none bg-transparent px-3 py-2 text-sm text-[#403e35] outline-none placeholder:text-[#999386] disabled:opacity-50"
              />

              {/* =========================
                  INPUT ACTIONS
              ========================= */}

              <div className="mt-2 flex items-center gap-2 border-t border-[#aaa294]/20 pt-3">

                {/* File input */}

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.html,.css"
                  onChange={handleFileChange}
                />

                {/* Attach */}

                <button
                  type="button"
                  aria-label="Attach file"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#777467] transition hover:bg-white/60 active:scale-95"
                >
                  <Paperclip size={17} />
                </button>

                <span className="hidden text-[10px] text-[#999386] sm:block">
                  Enter to send · Shift + Enter for new line
                </span>

                {/* Send */}

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#d9a9a3] text-white shadow-[0_8px_25px_rgba(170,110,100,0.25)] transition-all duration-200 hover:scale-105 hover:bg-[#ce9991] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send size={17} />
                </button>

              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#999386]">
            <ArrowDown size={11} />
            DELYRA can plan, search, calculate, organize and remember.
          </div>

        </div>
      </div>
    </div>
  );
}

export default Chat;