"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BarChart3, Users, BrainCircuit, LifeBuoy, ArrowLeft, LogOut, Menu, X } from "lucide-react";

const NAV = [
  { path: "/admin", label: "analytics", icon: BarChart3 },
  { path: "/admin/users", label: "users", icon: Users },
  { path: "/admin/interviews", label: "interviews", icon: BrainCircuit },
  { path: "/admin/support", label: "tickets", icon: LifeBuoy },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => (path === "/admin" ? pathname === "/admin" : pathname.startsWith(path));

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
      {/* Mobile top bar */}
      <div className="lg:hidden w-full sticky top-0 z-40 border-b border-[#494454] bg-[#0e0e12]">
        <div className="flex items-center justify-between px-4 py-3.5">
          <button onClick={() => go("/admin")} className="flex items-center gap-2.5 cursor-pointer">
            <span className="font-extrabold text-[17px] leading-none tracking-[-.5px] text-[#d0bcff]">prepai</span>
            <span className="text-[9.5px] font-bold text-[#d0bcff] uppercase tracking-[.4px] border border-[#d0bcff]/30 px-2 py-0.5">admin</span>
          </button>
          <button onClick={() => setMobileOpen((v) => !v)} className="text-[#e4e1e8] p-1.5 cursor-pointer" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#494454]">
            <ul className="space-y-2 pt-2 pb-2">
              {NAV.map(({ path, label, icon: Icon }) => {
                const active = isActive(path);
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
              <button onClick={() => go("/dashboard")} className="text-left text-[12px] font-bold tracking-[.2em] uppercase text-[#958ea0] hover:text-[#e4e1e8] px-2 py-2.5 flex items-center gap-4 cursor-pointer">
                <ArrowLeft className="w-4 h-4 flex-none" /> {`// exit admin`}
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
          <div className="flex items-center gap-3">
            <h1 className="font-extrabold text-[22px] leading-none tracking-[-.5px] text-[#d0bcff] m-0">prepai</h1>
            <span className="text-[9.5px] font-bold text-[#d0bcff] uppercase tracking-[.4px] border border-[#d0bcff]/30 px-2 py-0.5">admin</span>
          </div>
          <p className="text-[10.5px] text-[#6f6f7c] uppercase tracking-[.3px] mt-2.5">{"// admin panel"}</p>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2">
            {NAV.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
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
