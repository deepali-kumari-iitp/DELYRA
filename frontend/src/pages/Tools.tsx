import {
  Search,
  Calculator,
  Code2,
  FileSearch,
  StickyNote,
  Brain,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const tools = [
  {
    name: "Web Search",
    description: "Find current information from the web using Tavily.",
    icon: Search,
    status: "Active",
  },
  {
    name: "Calculator",
    description: "Perform accurate mathematical calculations.",
    icon: Calculator,
    status: "Active",
  },
  {
    name: "Code Helper",
    description: "Understand, debug and improve code.",
    icon: Code2,
    status: "Coming Soon",
  },
  {
    name: "File Analyzer",
    description: "Analyze and summarize uploaded documents.",
    icon: FileSearch,
    status: "Active",
  },
  {
    name: "Notes",
    description: "Create and organize persistent notes.",
    icon: StickyNote,
    status: "Active",
  },
  {
    name: "Memory",
    description: "Save and retrieve useful conversation information.",
    icon: Brain,
    status: "Active",
  },
];

function Tools() {
  const activeTools = tools.filter(
    (tool) => tool.status === "Active"
  ).length;

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <p className="text-xs uppercase tracking-widest text-[#777467]">
        DELYRA toolkit
      </p>

      <h1 className="font-['Playfair_Display'] text-5xl mt-2">
        Tools
      </h1>

      <p className="text-sm text-[#777467] mt-3">
        Tools DELYRA can use to get things done.
      </p>

      {/* TOOL SUMMARY */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mt-8">
        <div className="bg-white/60 border border-white rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d9e0d2] flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-xs text-[#777467]">
                Active tools
              </p>

              <p className="font-['Playfair_Display'] text-2xl mt-1">
                {activeTools}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 border border-white rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8dfd1] flex items-center justify-center">
              <Clock3 size={18} />
            </div>

            <div>
              <p className="text-xs text-[#777467]">
                Total capabilities
              </p>

              <p className="font-['Playfair_Display'] text-2xl mt-1">
                {tools.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.status === "Active";

          return (
            <div
              key={tool.name}
              className="text-left bg-white/60 border border-white rounded-3xl p-6 hover:bg-white/80 hover:-translate-y-1 transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#e8dfd1] flex items-center justify-center">
                  <Icon size={21} />
                </div>

                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-[#d9e0d2] text-[#59604b]"
                      : "bg-[#eee9df] text-[#777467]"
                  }`}
                >
                  {tool.status}
                </span>
              </div>

              <h2 className="font-['Playfair_Display'] text-2xl mt-5">
                {tool.name}
              </h2>

              <p className="text-sm text-[#777467] mt-2 leading-6">
                {tool.description}
              </p>

              <div className="flex items-center gap-2 mt-5 text-xs text-[#777467]">
                {isActive ? (
                  <>
                    <CheckCircle2 size={14} />
                    Available to DELYRA
                  </>
                ) : (
                  <>
                    <Clock3 size={14} />
                    Capability in development
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tools;