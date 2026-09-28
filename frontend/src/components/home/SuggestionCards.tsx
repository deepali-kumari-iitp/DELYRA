import {
  CalendarDays,
  Lightbulb,
  Code2,
  UserRound,
  FileText,
} from "lucide-react";

const suggestions = [
  {
    text: "Plan my next 7 days",
    icon: CalendarDays,
    accent: "bg-[#f0d8d4]",
  },
  {
    text: "Explain a concept in simple words",
    icon: Lightbulb,
    accent: "bg-[#eadfc8]",
  },
  {
    text: "Help me build a project",
    icon: Code2,
    accent: "bg-[#dce6dc]",
  },
  {
    text: "Prepare me for an interview",
    icon: UserRound,
    accent: "bg-[#e3dcef]",
  },
  {
    text: "Summarize a document",
    icon: FileText,
    accent: "bg-[#dce2ed]",
  },
];

function SuggestionCards() {
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-sm font-medium text-[#555247]">
          Try asking DELYRA
        </p>

        <span className="text-[#8b9276]">→</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.text}
              type="button"
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/30 p-4 text-left shadow-[0_8px_30px_rgba(60,50,40,0.07)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-[0_14px_35px_rgba(60,50,40,0.12)]"
            >
              {/* Soft glow */}
              <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/40 blur-xl opacity-0 transition group-hover:opacity-100" />

              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl ${item.accent} shadow-sm`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className="text-[#555247]"
                />
              </div>

              <span className="relative mt-4 block text-sm leading-5 text-[#403e35]">
                {item.text}
              </span>

              <div className="mt-4 h-px w-8 bg-[#8b9276]/30 transition-all duration-300 group-hover:w-14" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SuggestionCards;