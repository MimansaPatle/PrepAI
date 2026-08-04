"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Robot, BrandMark } from "@/components/ui/Brand";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const nav = [
    ["/dashboard", "Dashboard"],
    ["/history", "History"],
    ["/support", "Support"],
    ...(session?.user?.role === "admin" ? [["/admin", "Admin"]] : []),
  ];

  const isActive = (path) => (path === "/admin" ? pathname.startsWith("/admin") : pathname === path);

  return (
    <div className="border-b border-white/[.07] sticky top-0 z-30" style={{ background: "rgba(8,8,12,.78)", backdropFilter: "blur(12px)" }}>
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-3.5 flex items-center justify-between gap-3">
        <div onClick={() => router.push("/dashboard")} className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <BrandMark size="text-[17px]" withCaret={false} />
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-end">
          {nav.map(([path, label]) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              className="border-0 px-[15px] py-2 rounded-[10px] text-[12px] cursor-pointer uppercase tracking-[.5px]"
              style={
                isActive(path)
                  ? { background: "rgba(139,92,246,.16)", color: "#c4b5fd", fontWeight: 600 }
                  : { background: "transparent", color: "#8a8a97", fontWeight: 500 }
              }
            >
              {label}
            </button>
          ))}

          <div className="w-px h-5 bg-white/[.12] mx-2" />

          <button onClick={() => router.push("/profile")} className="flex items-center gap-2 bg-transparent border-0 text-[#c4c4cf] text-[12.5px] cursor-pointer">
            <span className="w-[26px] h-[26px] rounded-[9px]" style={{ background: "linear-gradient(135deg,#8b5cf6,#5b9be8)" }} />
            {session?.user?.name || "Engineer"}
          </button>

          <button onClick={handleLogout} title="Log out" className="bg-transparent border-0 text-[#6f6f7c] hover:text-bad cursor-pointer p-1.5">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
