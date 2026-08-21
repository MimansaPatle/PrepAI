"use client";

import { CheckCircle2, AlertTriangle, LoaderCircle, Info, X } from "lucide-react";

const STYLES = {
  success: { icon: CheckCircle2, color: "#34d399", tag: "sys_ok" },
  error: { icon: AlertTriangle, color: "#f87171", tag: "sys_error" },
  loading: { icon: LoaderCircle, color: "#a3c9ff", tag: "processing" },
  info: { icon: Info, color: "#d0bcff", tag: "sys_info" },
};

export default function AIAssistantToast({ show, title, description, type, onClose }) {
  const current = STYLES[type] || STYLES.info;
  if (!show) return null;

  const Icon = current.icon;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-[420px] animate-toast">
      <div className="relative overflow-hidden rounded-[4px] border border-[#494454]" style={{ background: "#1f1f24" }}>
        <div className="flex gap-3.5 p-4">
          <div
            className="flex w-9 h-9 items-center justify-center border flex-none"
            style={{ borderColor: `${current.color}55`, background: `${current.color}14` }}
          >
            <Icon className={`w-4 h-4 ${type === "loading" ? "animate-spin" : ""}`} style={{ color: current.color }} />
          </div>

          <div className="flex-1 min-w-0 pr-5">
            <p className="text-[10px] uppercase tracking-[.2em] font-bold" style={{ color: current.color }}>
              {`// ${current.tag}`}
            </p>
            <h3 className="mt-1 text-[14px] text-[#e4e1e8] lowercase">{title}</h3>
            {description && <p className="mt-1 text-[12px] leading-[1.6] text-[#958ea0] lowercase">{description}</p>}
          </div>

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-[#6f6f7c] hover:text-[#e4e1e8] transition-colors duration-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-[2px] animate-toast-progress" style={{ background: current.color }} />
      </div>
    </div>
  );
}
