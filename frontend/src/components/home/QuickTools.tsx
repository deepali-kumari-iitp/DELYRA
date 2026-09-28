import {
  Search,
  Calculator,
  Code2,
  FileText,
  Image,
  Brain,
} from "lucide-react";

const tools = [
  { name: "Web Search", icon: Search },
  { name: "Calculator", icon: Calculator },
  { name: "Code Helper", icon: Code2 },
  { name: "Summarizer", icon: FileText },
  { name: "Image Gen", icon: Image },
  { name: "Memory", icon: Brain },
];

function QuickTools() {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/25 p-6 shadow-[0_18px_50px_rgba(55,45,35,0.1)] backdrop-blur-2xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#e7b9b1]/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-[#d9e0d2]/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#777467]">
              DELYRA
            </p>

            <h2 className="mt-1 font-['Playfair_Display'] text-2xl text-[#292820]">
              Quick Tools
            </h2>
          </div>

          <span className="rounded-full border border-white/60 bg-white/35 px-3 py-1.5 text-[10px] text-[#777467] backdrop-blur-xl">
            6 tools
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.name}
                type="button"
                className="group/tool relative overflow-hidden rounded-2xl border border-white/50 bg-white/30 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/55 hover:shadow-md"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-white/40 blur-xl opacity-0 transition group-hover/tool:opacity-100" />

                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8dfd1]/70 text-[#777467] shadow-sm">
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <span className="relative mt-3 block text-xs text-[#403e35]">
                  {tool.name}
                </span>

                <div className="mt-3 h-px w-5 bg-[#8b9276]/30 transition-all duration-300 group-hover/tool:w-9" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuickTools;