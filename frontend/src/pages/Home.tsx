import Hero from "../components/home/Hero";
import PromptBox from "../components/home/PromptBox";
import SuggestionCards from "../components/home/SuggestionCards";
import DashboardCards from "../components/home/DashboardCards";
import AgentPanel from "../components/home/AgentPanel";
import QuickTools from "../components/home/QuickTools";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* =========================
          AMBIENT BACKGROUND
      ========================= */}

      <div className="pointer-events-none absolute inset-0 bg-[#e8e2d6]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.75),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(217,224,210,0.5),transparent_28%),radial-gradient(circle_at_55%_85%,rgba(231,185,177,0.28),transparent_30%)]" />

      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-white/35 blur-3xl" />

      <div className="pointer-events-none absolute right-[-120px] top-[30%] h-96 w-96 rounded-full bg-[#d9e0d2]/35 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-140px] left-[35%] h-96 w-96 rounded-full bg-[#e7b9b1]/20 blur-3xl" />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="relative z-10 mx-auto w-full max-w-[1650px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9 xl:px-10">

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px] xl:gap-7">

          {/* =========================
              MAIN WORKSPACE
          ========================= */}

          <main className="min-w-0">
            <Hero />

            <PromptBox />

            <SuggestionCards />

            <DashboardCards />
          </main>

          {/* =========================
              AI SIDEBAR
          ========================= */}

          <aside className="space-y-5 xl:pt-0">
            <AgentPanel />

            <QuickTools />
          </aside>

        </div>
      </div>
    </div>
  );
}

export default Home;