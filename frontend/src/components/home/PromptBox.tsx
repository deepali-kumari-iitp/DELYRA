import {
  Paperclip,
  Globe2,
  Sparkles,
  ArrowUp,
} from "lucide-react";

function PromptBox() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/50 bg-white/35 p-5 shadow-[0_20px_50px_rgba(60,50,40,0.12)] backdrop-blur-2xl sm:p-7">
      {/* Glass highlights */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#e7b9b1]/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#d9e0d2]/25 blur-3xl" />

      <div className="relative">
        {/* Prompt */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-['Playfair_Display'] text-2xl text-[#292820] sm:text-3xl">
            What can I do for you today?
          </h2>

          <span className="hidden text-xs italic text-[#777467] sm:block">
            Your AI partner ♡
          </span>
        </div>

        {/* Bottom controls */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-4 py-2.5 text-sm text-[#444239] shadow-sm backdrop-blur-xl transition hover:bg-white/70"
          >
            <Paperclip size={15} />
            Attach
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-4 py-2.5 text-sm text-[#444239] shadow-sm backdrop-blur-xl transition hover:bg-white/70"
          >
            <Globe2 size={15} />
            Search Web
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-4 py-2.5 text-sm text-[#444239] shadow-sm backdrop-blur-xl transition hover:bg-white/70"
          >
            <Sparkles size={15} />
            Use Tools
          </button>

          {/* Send */}
          <button
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#dca9a1] text-white shadow-[0_8px_25px_rgba(170,110,100,0.25)] transition hover:scale-105 hover:bg-[#ce9991]"
          >
            <ArrowUp size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PromptBox;