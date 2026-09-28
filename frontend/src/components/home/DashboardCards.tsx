import { Check, Clock, ArrowUpRight } from "lucide-react";

function DashboardCards() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Today's Focus */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-[#e8dfd1]/45 p-6 shadow-[0_15px_45px_rgba(60,50,40,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(60,50,40,0.13)]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#d9e0d2]/35 blur-3xl" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#777467]">
            Today's Focus
          </p>

          <h2 className="mt-3 font-['Playfair_Display'] text-2xl text-[#292820]">
            Keep moving forward.
          </h2>

          <div className="mt-6 space-y-4">
            {["DSA Practice", "React Project", "30 min English"].map(
              (task, index) => (
                <div
                  key={task}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      index === 0
                        ? "border-[#8b9276] bg-[#8b9276] text-white"
                        : "border-[#aaa294] bg-white/20"
                    }`}
                  >
                    {index === 0 && <Check size={12} />}
                  </div>

                  <span
                    className={`text-sm ${
                      index === 0
                        ? "text-[#403e35]"
                        : "text-[#68655b]"
                    }`}
                  >
                    {task}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="mt-6 h-px w-10 bg-[#8b9276]/40 transition-all duration-300 group-hover:w-16" />
        </div>
      </div>

      {/* Current Project */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/35 p-6 shadow-[0_15px_45px_rgba(60,50,40,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/45 hover:shadow-[0_20px_55px_rgba(60,50,40,0.13)]">
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-36 w-36 rounded-full bg-[#e7b9b1]/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#777467]">
              Current Project
            </p>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/30 transition hover:bg-white/60"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          <h2 className="mt-3 font-['Playfair_Display'] text-2xl text-[#292820]">
            DELYRA
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#777467]">
            Your AI agent for planning, learning and getting things done.
          </p>

          <div className="mt-7">
            <div className="mb-2 flex justify-between text-xs text-[#777467]">
              <span>Progress</span>
              <span>35%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/50">
              <div className="h-full w-[35%] rounded-full bg-[#8b9276] shadow-[0_0_12px_rgba(139,146,118,0.3)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Activity */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-[#ded8c9]/45 p-6 shadow-[0_15px_45px_rgba(60,50,40,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(60,50,40,0.13)]">
        <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#d9e0d2]/30 blur-3xl" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#777467]">
            Agent Activity
          </p>

          <h2 className="mt-3 font-['Playfair_Display'] text-2xl text-[#292820]">
            Recent activity
          </h2>

          <div className="mt-6 space-y-5">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/45">
                <Clock size={15} className="text-[#777467]" />
              </div>

              <div>
                <p className="text-sm text-[#403e35]">
                  Created learning plan
                </p>

                <p className="mt-1 text-xs text-[#777467]">
                  12 min ago
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9e0d2]/60">
                <Check size={15} className="text-[#59604b]" />
              </div>

              <div>
                <p className="text-sm text-[#403e35]">
                  Completed task
                </p>

                <p className="mt-1 text-xs text-[#777467]">
                  1 hour ago
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-px w-10 bg-[#8b9276]/40 transition-all duration-300 group-hover:w-16" />
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;