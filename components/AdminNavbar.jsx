"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    IoGridOutline,
    IoPeopleOutline,
    IoDocumentTextOutline,
    IoArrowBackOutline,
    IoChatbubbleEllipsesOutline,
} from "react-icons/io5";

export default function AdminNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const links = [
        {
            label: "Overview",
            path: "/admin",
            icon: IoGridOutline,
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: IoPeopleOutline,
        },
        {
            label: "Interviews",
            path: "/admin/interviews",
            icon: IoDocumentTextOutline,
        },
        {
            label: "Support",
            path: "/admin/support",
            icon: IoChatbubbleEllipsesOutline,
        },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-xl">
            <div className="px-6 md:px-12 h-16 flex items-center justify-between">

                {/* Logo */}
                <div
                    onClick={() => router.push("/admin")}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white">
                        P
                    </div>

                    <div>
                        <span className="text-sm font-bold text-white">
                            PrepAI
                        </span>

                        <span className="text-[10px] text-violet-400 ml-2 font-mono">
                            ADMIN
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">

                    {links.map((link) => {
                        const Icon = link.icon;

                        const active =
                            link.path === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(link.path);

                        return (
                            <button
                                key={link.path}
                                onClick={() => router.push(link.path)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active
                                        ? "bg-violet-500/10 text-violet-400"
                                        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                                    }`}
                            >
                                <Icon />
                                {link.label}
                            </button>
                        );
                    })}

                </div>

                {/* Exit */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition"
                >
                    <IoArrowBackOutline />
                    Exit Admin
                </button>

            </div>
        </nav>
    );
}