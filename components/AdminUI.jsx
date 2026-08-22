"use client";

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
      <div>
        <span className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-2 block">{`// ${eyebrow}`}</span>
        <h1 className="font-display text-[30px] sm:text-[36px] leading-[1.1] text-[#e4e1e8] m-0">{title}</h1>
        {description && <p className="text-[13px] text-[#8a8a97] mt-2 max-w-[520px]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ActionButton({ children, ghost = false, ...rest }) {
  return (
    <button
      {...rest}
      className={`text-[11.5px] uppercase tracking-[.2em] font-bold px-5 py-3 border transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer ${rest.className || ""}`}
      style={
        ghost
          ? { background: "transparent", borderColor: "#494454", color: "#958ea0" }
          : { background: "#1f1f24", borderColor: "rgba(208,188,255,.35)", color: "#d0bcff" }
      }
    >
      {children}
    </button>
  );
}

export function Panel({ children, className = "", ...rest }) {
  return (
    <div className={`border border-[#494454] bg-[#1f1f24] ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function StatTile({ label, value, delta, color = "#e4e1e8" }) {
  return (
    <Panel className="p-5">
      <span className="text-[10.5px] font-bold tracking-[.2em] text-[#958ea0] uppercase block mb-3">{`// ${label}`}</span>
      <div className="font-display text-[26px] tracking-[.03em]" style={{ color }}>{value}</div>
      {delta !== undefined && <div className="text-[11px] text-[#6f6f7c] mt-2">{delta}</div>}
    </Panel>
  );
}

export function Tag({ children, tone = "neutral" }) {
  const tones = {
    neutral: { color: "#958ea0", borderColor: "#494454" },
    purple: { color: "#d0bcff", borderColor: "rgba(208,188,255,.35)" },
    good: { color: "#34d399", borderColor: "rgba(52,211,153,.35)" },
    bad: { color: "#ffb4ab", borderColor: "rgba(255,180,171,.35)" },
  };
  return (
    <span
      className="inline-flex text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-1 border"
      style={tones[tone] || tones.neutral}
    >
      {children}
    </span>
  );
}

export function Avatar({ name }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="w-8 h-8 border border-[#494454] flex items-center justify-center flex-none font-display text-[13px] text-[#d0bcff]">
      {initial}
    </span>
  );
}

export const searchFieldClass =
  "w-full bg-[#1f1f24] border border-[#494454] px-4 py-3 text-[13px] text-[#e4e1e8] outline-none placeholder:text-[#6f6f7c] focus:border-[#d0bcff]/50 transition-colors";

export const theadClass = "border-b border-[#494454] text-[#6f6f7c] text-[10px] font-bold uppercase tracking-[.2em]";
export const tbodyRowClass = "border-b border-[#2a292e] last:border-0 text-[13px] text-[#cbc3d7]";
