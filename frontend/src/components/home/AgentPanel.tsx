import {
  Bot,
  Brain,
  Search,
  ListChecks,
  BookOpen,
  Zap,
} from "lucide-react";

const actions = [
  { name: "Plan", icon: Brain },
  { name: "Research", icon: Search },
  { name: "Organize", icon: ListChecks },
  { name: "Learn", icon: BookOpen },
  { name: "Execute", icon: Zap },
];

function AgentPanel() {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/25 p-6 shadow-[0_20px_55px_rgba(55,45,35,0.12)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/30">
      {/* Ambient glass glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#d9e0d2]/35 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#e7b9b1]/20 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#777467]">
            Your AI Partner
          </span>

          <span className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/35 px-3 py-1.5 text-[10px] text-[#59604b] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b9276]" />
            Idle
          </span>
        </div>

        {/* AI Orb */}
        <div className="my-8 flex justify-center">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 scale-125 rounded-full bg-[#8b9276]/20 blur-2xl" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-[#8b9276]/80 text-white shadow-[0_12px_35px_rgba(90,100,75,0.28)] backdrop-blur-xl transition-transform duration-500 group-hover:scale-105">
              <Bot size={40} strokeWidth={1.2} />
            </div>
          </div>
        </div>

        {/* Identity */}
        <h2 className="text-center font-['Playfair_Display'] text-3xl text-[#292820]">
          DELYRA
        </h2>

        <p className="mt-2 text-center text-sm leading-6 text-[#777467]">
          More than an AI.
          <br />
          A partner in your journey.
        </p>

        {/* Divider */}
        <div className="mx-auto mt-6 h-px w-12 bg-[#8b9276]/30" />

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.name}
                type="button"
                className={`flex items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/35 py-3 text-xs text-[#403e35] shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-md ${
                  action.name === "Execute"
                    ? "col-span-2"
                    : ""
                }`}
              >
                <Icon
                  size={14}
                  strokeWidth={1.8}
                  className="text-[#686c5a]"
                />

                {action.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AgentPanel;