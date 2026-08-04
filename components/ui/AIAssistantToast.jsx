"use client";

import {
    Bot,
    CheckCircle2,
    AlertTriangle,
    LoaderCircle,
    Info,
    X,
} from "lucide-react";

export default function AIAssistantToast({
    show,
    title,
    description,
    type,
    onClose,
}) {

    const styles = {
        success: {
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
            badge: "text-emerald-400",
            iconBg: "bg-emerald-500/15 border border-emerald-500/20",
            border: "border-emerald-500/25",
        },

        error: {
            icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
            badge: "text-red-400",
            iconBg: "bg-red-500/15 border border-red-500/20",
            border: "border-red-500/25",
        },

        loading: {
            icon: <LoaderCircle className="w-5 h-5 text-violet-400 animate-spin" />,
            badge: "text-violet-400",
            iconBg: "bg-violet-500/15 border border-violet-500/20",
            border: "border-violet-500/25",
        },

        info: {
            icon: <Info className="w-5 h-5 text-sky-400" />,
            badge: "text-sky-400",
            iconBg: "bg-sky-500/15 border border-sky-500/20",
            border: "border-sky-500/25",
        },
    };

    const current = styles[type];
    if (!show) return null;



    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-[420px] animate-toast">

            <div className={`overflow-hidden rounded-2xl border ${current.border} bg-zinc-950/95 backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.15)]`}>

                <div className="flex gap-4 p-5 relative">

                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${current.iconBg}`}>

                        {current.icon}

                    </div>

                    <div className="flex-1">

                        <p className={`text-[11px] uppercase tracking-[0.25em] font-semibold ${current.badge}`}>
                            AI Assistant
                        </p>

                        <h3 className="mt-1 text-base font-semibold text-white">
                            {title}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                            {description}
                        </p>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>

                    </div>

                </div>

                <div className="h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 animate-toast-progress" />

            </div>

        </div>
    );
}