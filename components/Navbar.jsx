"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { IoTerminalOutline, IoLogOutOutline } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="w-full border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">

      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl text-white">
          <IoTerminalOutline className="text-xl" />
        </div>

        <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          PrepAI
        </span>
      </div>

      <div className="flex items-center gap-6">

        <button
          onClick={() => router.push("/dashboard")}
          className={`text-sm transition ${pathname === "/dashboard"
            ? "text-violet-400 font-medium"
            : "text-zinc-400 hover:text-white"
            }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/history")}
          className={`text-sm transition ${pathname === "/history"
            ? "text-violet-400 font-medium"
            : "text-zinc-400 hover:text-white"
            }`}
        >
          History
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <button
            onClick={() => router.push("/profile")}
            className={`flex items-center gap-2 text-sm font-medium transition ${pathname === "/profile"
                ? "text-violet-400"
                : "text-zinc-300 hover:text-violet-400"
              }`}
          >
            <IoPersonCircleOutline className="text-lg" />
            {session?.user?.name || "Engineer"}
          </button>

          <button
            onClick={handleLogout}
            className="text-zinc-500 hover:text-rose-400 transition p-1.5 rounded-lg hover:bg-zinc-900/60"
            title="Logout and Reset Session"
          >
            <IoLogOutOutline className="text-lg" />
          </button>
        </div>
      </div>

    </nav>
  );
}