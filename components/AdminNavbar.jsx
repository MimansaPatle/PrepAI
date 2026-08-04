"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Robot, BrandMark } from "@/components/ui/Brand";

const LINKS = [
  { label: "Analytics", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Interviews", path: "/admin/interviews" },
  { label: "Tickets", path: "/admin/support" },
];

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="border-b border-white/[.07] sticky top-0 z-30" style={{ background: "rgba(8,8,12,.78)", backdropFilter: "blur(12px)" }}>
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-3.5 flex items-center justify-between gap-3 flex-wrap">
        <div onClick={() => router.push("/admin")} className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <Robot v="b" className="w-[30px] h-[30px] object-contain" />
          <BrandMark size="text-[17px]" withCaret={false} />
          <span className="text-[10px] text-purple-light font-mono uppercase tracking-[.4px] border border-purple/30 rounded-full px-2 py-0.5">admin</span>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {LINKS.map((link) => {
            const active = link.path === "/admin" ? pathname === "/admin" : pathname.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className="border-0 px-[15px] py-2 rounded-[10px] text-[12px] cursor-pointer uppercase tracking-[.5px]"
                style={active ? { background: "rgba(139,92,246,.16)", color: "#c4b5fd", fontWeight: 600 } : { background: "transparent", color: "#8a8a97", fontWeight: 500 }}
              >
                {link.label}
              </button>
            );
          })}

          <div className="w-px h-5 bg-white/[.12] mx-2" />

          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1.5 text-[12px] text-[#8a8a97] cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> exit admin
          </button>
        </div>
      </div>
    </div>
  );
}
