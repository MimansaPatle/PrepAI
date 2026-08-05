"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

function RobotMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="robotMarkGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b9be8" />
        </linearGradient>
      </defs>
      <path
        fill="url(#robotMarkGradient)"
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5A2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5"
      />
    </svg>
  );
}

export function Robot({ v = "b", className = "" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/robot-${v}.png`}
      alt="PrepAI mascot"
      className={className}
      style={{ filter: "drop-shadow(0 10px 18px rgba(91,155,232,.4))" }}
    />
  );
}

export function Label({ children, className = "" }) {
  return (
    <div className={`text-[11px] text-purple tracking-[.8px] mb-3 uppercase ${className}`}>
      {children}
    </div>
  );
}

export function Card({ children, className = "", ...rest }) {
  return (
    <div className={`bg-panel border border-white/[.07] rounded-2xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export const fieldClass =
  "w-full bg-field border border-white/[.1] rounded-[11px] px-3.5 py-3 text-[13.5px] outline-none text-[#f2f2f5]";
export const labelClass = "text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5 block";

export function BrandMark({ size = "text-[19px]", withCaret = true }) {
  return (
    <span className="inline-flex items-center gap-2">
      <RobotMark className="w-7 h-7 flex-none" />
      <span className={`font-extrabold ${size} tracking-[-1px]`}>
        prep<span className="text-purple-light">ai</span>
        {withCaret && <span className="text-purple animate-caret">_</span>}
      </span>
    </span>
  );
}

export const SKILL_SUGGESTIONS = [
  "React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "MySQL",
  "TypeScript", "JavaScript", "Python", "Django", "Flask", "Java", "Spring Boot",
  "Redux", "GraphQL", "REST APIs", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "Tailwind CSS", "HTML/CSS", "Vue.js", "Angular", "Git", "CI/CD", "Microservices",
  "System Design", "Data Structures", "Algorithms", "Firebase", "Redis", "Socket.io",
  "C++", "C#", ".NET", "PHP", "Laravel", "Ruby on Rails", "Go", "Rust", "Swift", "Kotlin",
];

export const COMPANY_SUGGESTIONS = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber", "Adobe",
  "TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "Cognizant", "HCL Tech",
  "Flipkart", "Swiggy", "Zomato", "Paytm", "Salesforce", "Oracle", "IBM", "SAP",
  "Goldman Sachs", "JPMorgan Chase", "Deloitte", "Atlassian", "Stripe", "Airbnb",
  "LinkedIn", "Tesla", "Samsung", "Intel", "PayPal", "Spotify", "Zoho",
];

function useOutsideClick(ref, onOutside) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

export function AutocompleteInput({ value, onChange, suggestions, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => setOpen(false));

  const query = value.trim().toLowerCase();
  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query) && s.toLowerCase() !== query).slice(0, 6)
    : [];

  return (
    <div className="relative" ref={wrapRef}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={fieldClass}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full bg-field border border-white/[.1] rounded-[11px] overflow-hidden shadow-xl max-h-[220px] overflow-y-auto">
          {filtered.map((s) => (
            <div
              key={s}
              onMouseDown={() => { onChange(s); setOpen(false); }}
              className="px-3.5 py-2.5 text-[13px] text-[#e6e6ec] hover:bg-purple/15 cursor-pointer"
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SkillTagInput({ value, onChange, suggestions, placeholder = "type to add a skill…" }) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => setOpen(false));

  const tags = value.split(",").map((s) => s.trim()).filter(Boolean);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange(tags.length ? `${value}, ${trimmed}` : trimmed);
    setDraft("");
    setOpen(false);
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag).join(", "));

  const filtered = draft.trim()
    ? suggestions
        .filter((s) => s.toLowerCase().includes(draft.trim().toLowerCase()) && !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className="relative" ref={wrapRef}>
      <div className="w-full bg-field border border-white/[.1] rounded-[11px] px-3 py-2 flex flex-wrap gap-1.5 items-center">
        {tags.map((t) => (
          <span
            key={t}
            onClick={() => removeTag(t)}
            title="Click to remove"
            className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-full border cursor-pointer"
            style={{ background: "rgba(139,92,246,.14)", borderColor: "rgba(139,92,246,.26)", color: "#c4b5fd" }}
          >
            {t} <X className="w-3 h-3" />
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTag(draft); }
            if (e.key === "Backspace" && !draft && tags.length) removeTag(tags[tags.length - 1]);
          }}
          placeholder={tags.length ? "add another…" : placeholder}
          className="flex-1 min-w-[110px] bg-transparent outline-none text-[13px] text-[#f2f2f5] placeholder:text-[#5c5c68] py-1"
          autoComplete="off"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full bg-field border border-white/[.1] rounded-[11px] overflow-hidden shadow-xl max-h-[220px] overflow-y-auto">
          {filtered.map((s) => (
            <div key={s} onMouseDown={() => addTag(s)} className="px-3.5 py-2.5 text-[13px] text-[#e6e6ec] hover:bg-purple/15 cursor-pointer">
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
