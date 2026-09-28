import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#e8e2d6]">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.75),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(217,224,210,0.45),transparent_28%),radial-gradient(circle_at_55%_90%,rgba(231,185,177,0.22),transparent_30%)]" />

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />

        <div className="absolute right-[-100px] top-[45%] h-80 w-80 rounded-full bg-[#d9e0d2]/30 blur-3xl" />
      </div>

      {/* Mobile navigation */}
      <MobileNav />

      <div className="relative z-10 flex min-h-screen">

        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main application area */}
        <main className="min-w-0 flex-1">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default MainLayout;