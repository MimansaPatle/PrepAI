"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Settings2, Target, Bell, Square, SquareCheck,
} from "lucide-react";
import { SKILL_SUGGESTIONS, COMPANY_SUGGESTIONS } from "@/components/ui/Brand";
import { useToast } from "@/components/ui/ToastProvider";

const EXPERIENCE_TIERS = [
  { value: "Fresher", label: "fresher" },
  { value: "1–2 Years", label: "mid-level" },
  { value: "3+ Years", label: "senior" },
];

const ROLE_SUGGESTIONS = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Python Developer",
  "Software Engineer", "Data Scientist", "Data Engineer", "Data Analyst", "ML Engineer",
  "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Mobile Developer",
  "Android Developer", "iOS Developer", "QA Engineer", "Security Engineer",
  "Blockchain Developer", "Game Developer", "UI/UX Designer", "Product Manager",
];

const COACH_TONES = [
  { value: "technical", label: "technical" },
  { value: "supportive", label: "supportive" },
  { value: "aggressive", label: "aggressive" },
];

const DEPTH_LABELS = ["light", "standard", "deep", "intense", "max"];

const ctaStyle = { boxShadow: "0 0 20px 0 rgba(208,188,255,.2)" };

function useOutsideClick(ref, onOutside) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

function formatUptime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function Panel({ icon: Icon, title, children }) {
  return (
    <div className="p-6 sm:p-7 rounded-[4px] border border-[#494454]" style={{ background: "#1f1f24" }}>
      <h3 className="text-[11px] font-bold tracking-[.2em] text-[#e4e1e8] uppercase mb-6 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-[#d0bcff] flex-none" /> {`// ${title}`}
      </h3>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="text-[10.5px] font-bold tracking-[.15em] text-[#cbc3d7] uppercase mb-2.5 block">{children}</label>;
}

function UnderlineField({ label, value, onChange, disabled, required, placeholder }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-transparent border-0 border-b outline-none text-[14px] py-2 transition-colors ${
          disabled
            ? "border-[#3a3a42] text-[#6f6f7c] cursor-not-allowed"
            : "border-[#494454] text-[#e4e1e8] focus:border-[#d0bcff]"
        }`}
      />
    </div>
  );
}

function UnderlineAutocomplete({ label, value, onChange, suggestions, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => setOpen(false));

  const query = (value || "").trim().toLowerCase();
  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query) && s.toLowerCase() !== query).slice(0, 6)
    : [];

  return (
    <div className="relative" ref={wrapRef}>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-transparent border-0 border-b border-[#494454] focus:border-[#d0bcff] outline-none text-[14px] text-[#e4e1e8] placeholder:text-[#6f6f7c] py-2 transition-colors"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full bg-[#1f1f24] border border-[#494454] max-h-[220px] overflow-y-auto">
          {filtered.map((s) => (
            <div
              key={s}
              onMouseDown={() => { onChange(s); setOpen(false); }}
              className="px-3.5 py-2.5 text-[13px] text-[#e4e1e8] hover:bg-[#d0bcff]/10 cursor-pointer"
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TagField({ value, onChange, suggestions }) {
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
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((t) => (
          <span
            key={t}
            onClick={() => removeTag(t)}
            title="Click to remove"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#d0bcff]/50 text-[#d0bcff] text-[11px] font-bold uppercase tracking-[.05em] cursor-pointer hover:border-[#d0bcff]"
            style={{ background: "rgba(208,188,255,.08)" }}
          >
            {t} ×
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
          placeholder={tags.length ? "+ add skill" : "type to add a skill…"}
          autoComplete="off"
          className="flex-1 min-w-[140px] bg-transparent outline-none text-[13px] text-[#e4e1e8] placeholder:text-[#6f6f7c] py-1.5 px-2.5 border border-dashed border-[#494454] focus:border-[#d0bcff]/60 transition-colors"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full max-w-[320px] bg-[#1f1f24] border border-[#494454] max-h-[220px] overflow-y-auto">
          {filtered.map((s) => (
            <div key={s} onMouseDown={() => addTag(s)} className="px-3.5 py-2.5 text-[13px] text-[#e4e1e8] hover:bg-[#d0bcff]/10 cursor-pointer">
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TierButtonGroup({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`py-3 text-[11px] uppercase tracking-[.1em] font-semibold border transition-all duration-200 hover:scale-[1.03] cursor-pointer ${
              active ? "border-[#d0bcff] text-[#d0bcff]" : "border-[#494454] text-[#958ea0] hover:border-[#6f6f7c]"
            }`}
            style={active ? { background: "rgba(208,188,255,.08)", boxShadow: "0 0 0 1px rgba(208,188,255,.5)" } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-[.15em] text-[#e4e1e8]">{label}</div>
        <div className="text-[11px] text-[#6f6f7c] mt-1">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className="relative w-11 h-6 rounded-full flex-none transition-colors duration-200 cursor-pointer"
        style={{ background: checked ? "#a3c9ff" : "#2a292e" }}
      >
        <span
          className="absolute left-0.5 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
          style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

function CheckboxRow({ label, desc, checked, onChange }) {
  const Icon = checked ? SquareCheck : Square;
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-start gap-3 text-left w-full group cursor-pointer">
      <Icon className={`w-4 h-4 flex-none mt-0.5 transition-colors ${checked ? "text-[#d0bcff]" : "text-[#494454] group-hover:text-[#6f6f7c]"}`} />
      <div>
        <div className={`text-[11px] font-bold uppercase tracking-[.15em] ${checked ? "text-[#e4e1e8]" : "text-[#958ea0]"}`}>{label}</div>
        <div className="text-[11px] text-[#6f6f7c] mt-1">{desc}</div>
      </div>
    </button>
  );
}

export default function ProfileView() {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [favoriteRole, setFavoriteRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Decorative / client-only preferences — no backend field exists for any
  // of these yet, so they live purely in local state (same pattern as the
  // login page's SESSION_ID/LATENCY readouts). They still respond to
  // interaction within the session; they just don't survive a reload.
  const [coachTone, setCoachTone] = useState("technical");
  const [depth, setDepth] = useState(3);
  const [hints, setHints] = useState(true);
  const [archive, setArchive] = useState(false);
  const [notif, setNotif] = useState({ critical: true, reminders: true, weekly: false });

  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.success) {
          const user = data.user;
          setName(user.name || "");
          setEmail(user.email || "");
          setExperience(user.experience || "Fresher");
          setFavoriteRole(user.favoriteRole || "Frontend Developer");
          setTargetCompany(user.targetCompany || "");
          setSkills(user.skills || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, experience, favoriteRole, targetCompany, skills }),
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          setSaving(false);
          showToast({ title: "profile updated", description: "your changes have been saved." });
        }, 500);
        return;
      }

      setSaving(false);
      showToast({ title: "save failed", description: data.message || "please try again.", type: "error" });
    } catch (err) {
      console.error(err);
      setSaving(false);
      showToast({ title: "save failed", description: "something went wrong.", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="font-display text-[16px] text-[#958ea0] uppercase tracking-[.2em] flex items-center gap-2">
          {"// loading your profile"} <span className="inline-block w-2.5 h-2.5 bg-[#d0bcff] animate-blockcaret" />
        </p>
      </div>
    );
  }

  return (
    <div className="animate-rise flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#494454]">
        <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[.2em] text-[#958ea0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-pulse flex-none" />
          account settings <span className="text-[#494454]">//</span> connected
        </div>
        <div className="text-right text-[10px] uppercase tracking-[.15em] text-[#6f6f7c] leading-[1.7]">
          <div>time here: <span className="text-[#a3c9ff]">{formatUptime(uptime)}</span></div>
        </div>
      </div>

      <h1 className="font-display text-[34px] sm:text-[42px] text-[#e4e1e8] lowercase">settings</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="flex flex-col gap-8 min-w-0">
          <Panel icon={Settings2} title="basic info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <UnderlineField label="name" value={name} onChange={setName} required />
              <UnderlineField label="email" value={email} disabled />
            </div>
          </Panel>

          <Panel icon={Target} title="interview preferences">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <UnderlineAutocomplete label="target role" value={favoriteRole} onChange={setFavoriteRole} suggestions={ROLE_SUGGESTIONS} placeholder="e.g. Full Stack Developer" />
              <UnderlineAutocomplete label="target company" value={targetCompany} onChange={setTargetCompany} suggestions={COMPANY_SUGGESTIONS} placeholder="e.g. Google, Amazon…" />
            </div>

            <div className="mb-6">
              <FieldLabel>skills</FieldLabel>
              <TagField value={skills} onChange={setSkills} suggestions={SKILL_SUGGESTIONS} />
            </div>

            <div>
              <FieldLabel>experience level</FieldLabel>
              <TierButtonGroup options={EXPERIENCE_TIERS} value={experience} onChange={setExperience} />
            </div>
          </Panel>

          <Panel icon={Settings2} title="coach preferences">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-bold tracking-[.15em] text-[#cbc3d7] uppercase">coach tone</span>
              <span className="text-[9px] uppercase tracking-[.15em] text-[#6f6f7c] border border-[#494454] px-2 py-0.5">applies next session</span>
            </div>
            <div className="mb-6">
              <TierButtonGroup options={COACH_TONES} value={coachTone} onChange={setCoachTone} />
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-bold tracking-[.15em] text-[#cbc3d7] uppercase">feedback detail level</span>
              <span className="text-[12px] text-[#a3c9ff]">level {depth} ({DEPTH_LABELS[depth - 1]})</span>
            </div>
            <div className="flex gap-1.5 h-3 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDepth(i)}
                  aria-label={`level ${i}`}
                  className="flex-1 transition-all duration-200 hover:brightness-125 cursor-pointer"
                  style={{ background: i <= depth ? "#a3c9ff" : "#2a292e" }}
                />
              ))}
            </div>

            <div className="border-t border-[#494454] pt-6 flex flex-col gap-5">
              <ToggleRow label="live hints" desc="Show helpful tips while you're answering" checked={hints} onChange={setHints} />
              <ToggleRow label="save my answers" desc="Keep a private copy of your past interview answers" checked={archive} onChange={setArchive} />
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-8">
          <Panel icon={Bell} title="notifications">
            <div className="flex flex-col gap-5">
              <CheckboxRow
                label="important alerts"
                desc="Outages or security issues"
                checked={notif.critical}
                onChange={(v) => setNotif((n) => ({ ...n, critical: v }))}
              />
              <CheckboxRow
                label="practice reminders"
                desc="Reminders about upcoming practice sessions"
                checked={notif.reminders}
                onChange={(v) => setNotif((n) => ({ ...n, reminders: v }))}
              />
              <CheckboxRow
                label="weekly summary"
                desc="A weekly email with your progress"
                checked={notif.weekly}
                onChange={(v) => setNotif((n) => ({ ...n, weekly: v }))}
              />
            </div>
          </Panel>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#d0bcff] text-[#3c0091] text-[12px] font-bold tracking-[.2em] uppercase py-4 hover:bg-[#e9ddff] hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
            style={ctaStyle}
          >
            {saving ? "saving…" : "save changes >>"}
          </button>
        </div>
      </form>

      <div className="text-center text-[10px] uppercase tracking-[.25em] text-[#494454] pt-2">
        prepai settings // v3.4.1
      </div>
    </div>
  );
}
