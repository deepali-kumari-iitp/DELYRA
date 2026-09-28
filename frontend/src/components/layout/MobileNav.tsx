import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  ["Home", "/"],
  ["Chat", "/chat"],
  ["Tasks", "/tasks"],
  ["Projects", "/projects"],
  ["Notes", "/notes"],
  ["Knowledge", "/knowledge"],
  ["Tools", "/tools"],
  ["Calendar", "/calendar"],
  ["Analytics", "/analytics"],
  ["Settings", "/settings"],
];

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50 lg:hidden">
      {/* Mobile Header */}
      <div className="sticky top-0 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#292a21]/95 px-5 text-white shadow-[0_8px_30px_rgba(40,35,25,0.12)] backdrop-blur-2xl">

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <Sparkles size={16} className="text-[#d9c8a8]" />
          </div>

          <div>
            <h1 className="font-['Playfair_Display'] text-xl tracking-[0.18em]">
              DELYRA
            </h1>

            <p className="text-[7px] tracking-[0.18em] text-[#969287]">
              THINK · PLAN · DO
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#e8e2d6] transition-all duration-200 hover:bg-white/[0.12] active:scale-95"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute left-0 right-0 border-b border-white/10 bg-[#292a21]/98 px-4 pb-5 pt-3 shadow-[0_20px_45px_rgba(40,35,25,0.25)] backdrop-blur-2xl">

          <div className="space-y-1.5">
            {links.map(([name, path]) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-[#c4c0b5] hover:bg-white/[0.06] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#d9c8a8]" />
                    )}

                    <span>{name}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d9c8a8] shadow-[0_0_8px_rgba(217,200,168,0.5)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-white/[0.08] pt-4">
            <p className="px-4 text-[9px] uppercase tracking-[0.2em] text-[#777467]">
              Your AI workspace
            </p>

            <p className="px-4 pt-1 text-xs text-[#aaa79b]">
              Think · Plan · Do · Grow ♡
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;