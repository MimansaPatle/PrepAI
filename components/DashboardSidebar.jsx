"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, BrainCircuit, BarChart3, LifeBuoy, Settings, LogOut, Menu, X, Plus } from "lucide-react";

const NAV = [
  { path: "/dashboard", label: "dashboard", icon: LayoutGrid },
  { path: "/interview", label: "interviews", icon: BrainCircuit },
  { path: "/history", label: "progress", icon: BarChart3 },
  { path: "/support", label: "support", icon: LifeBuoy },
];

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await signOut({ redirect: false });
    router.push("/login");
  };

  const go = (path) => {
    setMobileOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Mobile top bar — replaces the old Navbar on every page using this shell */}
      <div className="lg:hidden w-full sticky top-0 z-40 border-b border-[#494454] bg-[#0e0e12]">
        <div className="flex items-center justify-between px-4 py-3.5">
          <button onClick={() => go("/dashboard")} className="flex items-center gap-2.5 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PrepAI" className="w-9 h-9 object-contain flex-none" />
            <span className="font-extrabold text-[17px] leading-none tracking-[-.5px] text-[#d0bcff]">PrepAI</span>
          </button>
          <button onClick={() => setMobileOpen((v) => !v)} className="text-[#e4e1e8] p-1.5 cursor-pointer" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#494454]">
            <button
              onClick={() => go("/interview")}
              className="w-full flex items-center gap-3.5 px-6 py-4 text-left cursor-pointer group"
            >
              <span className="w-8 h-8 rounded-[6px] border border-[#d0bcff]/40 flex items-center justify-center flex-none text-[#d0bcff] group-hover:bg-[#d0bcff]/10 transition-colors">
                <Plus className="w-4 h-4" />
              </span>
              <span className="text-[12px] font-bold tracking-[.2em] uppercase text-[#d0bcff]">{"// new interview"}</span>
            </button>

            <ul className="space-y-2 pb-2">
              {NAV.map(({ path, label, icon: Icon }) => {
                const active = pathname === path;
                return (
                  <li key={label}>
                    <button
                      onClick={() => go(path)}
                      className={`w-full text-left px-6 py-4 flex items-center gap-4 border-l-4 text-[12px] font-bold tracking-[.2em] uppercase transition-colors duration-200 cursor-pointer ${
                        active
                          ? "text-[#d0bcff] border-[#d0bcff]"
                          : "text-[#958ea0] border-transparent hover:text-[#e4e1e8] hover:bg-[#2a292e]"
                      }`}
                      style={active ? { background: "rgba(53,52,57,.3)" } : undefined}
                    >
                      <Icon className="w-[18px] h-[18px] flex-none" />
                      {`// ${label}`}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="p-4 border-t border-[#494454] flex flex-col gap-1">
              <button onClick={() => go("/profile")} className="text-left text-[12px] font-bold tracking-[.2em] uppercase text-[#958ea0] hover:text-[#e4e1e8] px-2 py-2.5 flex items-center gap-4 cursor-pointer">
                <Settings className="w-4 h-4 flex-none" /> {`// settings`}
              </button>
              <button onClick={handleLogout} className="text-left text-[12px] font-bold tracking-[.2em] uppercase text-[#958ea0] hover:text-[#e4e1e8] px-2 py-2.5 flex items-center gap-4 cursor-pointer">
                <LogOut className="w-4 h-4 flex-none" /> {`// logout`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 w-64 border-r border-[#494454] bg-[#0e0e12] z-40 shrink-0">
        <div className="p-6 border-b border-[#494454]">
          <div className="flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PrepAI" className="w-12 h-12 object-contain flex-none" />
            <h1 className="font-extrabold text-[22px] leading-none tracking-[-.5px] text-[#d0bcff] m-0">PrepAI</h1>
          </div>
        </div>

       

        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2">
            {NAV.map(({ path, label, icon: Icon }) => {
              const active = pathname === path;
              return (
                <li key={label}>
                  <button
                    onClick={() => router.push(path)}
                    className={`w-full text-left px-6 py-4 flex items-center gap-4 border-l-4 text-[12px] font-bold tracking-[.2em] uppercase transition-all duration-200 cursor-pointer ${
                      active
                        ? "text-[#d0bcff] border-[#d0bcff]"
                        : "text-[#958ea0] border-transparent hover:text-[#e4e1e8] hover:bg-[#2a292e] hover:translate-x-1"
                    }`}
                    style={active ? { background: "rgba(53,52,57,.3)" } : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] flex-none" />
                    {`// ${label}`}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-6 border-t border-[#494454] mt-auto">
          <ul className="space-y-2">
            <li>
              <button onClick={() => router.push("/profile")} className="w-full text-left text-[12px] font-bold tracking-[.2em] uppercase text-[#958ea0] hover:text-[#e4e1e8] hover:translate-x-1 px-2 py-2 flex items-center gap-4 transition-all duration-200 cursor-pointer">
                <Settings className="w-4 h-4 flex-none" />
                {`// settings`}
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left text-[12px] font-bold tracking-[.2em] uppercase text-[#958ea0] hover:text-[#e4e1e8] hover:translate-x-1 px-2 py-2 flex items-center gap-4 transition-all duration-200 cursor-pointer">
                <LogOut className="w-4 h-4 flex-none" />
                {`// logout`}
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
