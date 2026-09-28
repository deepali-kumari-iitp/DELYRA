function Hero() {
  return (
    <section className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-white/30 bg-white/10 backdrop-blur-[3px] shadow-[0_20px_60px_rgba(55,45,35,0.12)]">
      {/* Soft glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-[#d9a9a3]/10" />

      {/* Decorative glow */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e8c4bd]/25 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-[#d9e0d2]/30 blur-3xl" />

      <div className="relative flex min-h-[300px] items-end px-8 py-10 sm:px-12 lg:px-16">
        <div>
          <p className="mb-3 text-sm tracking-wide text-[#625f56]">
            Good morning,
          </p>

          <h1 className="font-['Playfair_Display'] text-5xl leading-none tracking-tight text-[#292820] sm:text-6xl lg:text-7xl">
            Deepali{" "}
            <span className="text-[#b97870]">♡</span>
          </h1>

          <div className="mt-5 h-px w-20 bg-[#8b9276]/50" />

          <p className="mt-5 text-sm text-[#777467] sm:text-base">
            Same girl. Bigger dreams.
          </p>
        </div>

        {/* Handwritten-style accent */}
        <div className="absolute right-8 top-8 hidden rotate-[-4deg] text-right sm:block lg:right-12">
          <p className="font-['Playfair_Display'] text-lg italic text-[#777467]">
            Your AI partner ♡
          </p>
          <p className="mt-1 text-xs tracking-widest text-[#999386]">
            THINK · PLAN · DO · GROW
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;