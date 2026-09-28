import {
  Home,
  MessageSquare,
  CheckSquare,
  Folder,
  FileText,
  BookOpen,
  Wrench,
  CalendarDays,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Chat", icon: MessageSquare, path: "/chat" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Projects", icon: Folder, path: "/projects" },
  { label: "Notes", icon: FileText, path: "/notes" },
  { label: "Knowledge", icon: BookOpen, path: "/knowledge" },
  { label: "Tools", icon: Wrench, path: "/tools" },
  { label: "Calendar", icon: CalendarDays, path: "/calendar" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 lg:flex flex-col overflow-hidden border-r border-white/10 bg-[#292a21]/95 px-5 py-7 text-[#f5f0e7] shadow-[8px_0_35px_rgba(40,35,25,0.12)] backdrop-blur-2xl">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-56 w-56 rounded-full bg-[#8b9276]/10 blur-3xl" />

      {/* =========================
          BRAND
      ========================= */}

      <div className="relative mb-9 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner">
            <Sparkles size={17} className="text-[#d9c8a8]" />
          </div>

          <h1 className="font-['Playfair_Display'] text-2xl tracking-[0.18em]">
            DELYRA
          </h1>
        </div>

        <p className="mt-3 text-[9px] tracking-[0.22em] text-[#aaa79b]">
          THINK · PLAN · DO · GROW
        </p>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="relative flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-[#c4c0b5] hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#d9c8a8] shadow-[0_0_12px_rgba(217,200,168,0.35)]" />
                  )}

                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? "bg-[#8b9276]/25 text-[#e4dccb]"
                        : "bg-white/[0.035] text-[#aaa79b] group-hover:bg-white/[0.08] group-hover:text-[#e4dccb]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.7} />
                  </span>

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* =========================
          USER PROFILE
      ========================= */}

      <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7c6b7] font-semibold text-[#292a21] shadow-md">
            D
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm text-[#f5f0e7]">
              Deepali
            </p>

            <p className="mt-0.5 text-xs text-[#aaa79b]">
              Keep going ♡
            </p>
          </div>
        </div>

        <div className="mt-3 h-px bg-white/[0.07]" />

        <p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[#858277]">
          AI workspace
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;