"use client";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Workflow, Terminal, Square, SquareCheck } from "lucide-react";
import { SKILL_SUGGESTIONS, COMPANY_SUGGESTIONS } from "@/components/ui/Brand";
import { useToast } from "@/components/ui/ToastProvider";

const ROLES = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Python Developer"];

const EXPERIENCE_TIERS = [
  { value: "Fresher", label: "fresher" },
  { value: "1–2 Years", label: "mid-level" },
  { value: "3+ Years", label: "senior" },
];

const COMPLEXITY = [
  { value: "Easy", tier: "L1", label: "standard" },
  { value: "Medium", tier: "L2", label: "advanced" },
  { value: "Hard", tier: "L3", label: "expert" },
];

const PRESETS = [
  { role: "Full Stack Developer", difficulty: "Medium", dot: "#d0bcff" },
  { role: "Backend Developer", difficulty: "Hard", dot: "#a3c9ff" },
  { role: "Frontend Developer", difficulty: "Easy", dot: "#34d399" },
];

const STEPS = [
  { n: "1", t: "Set up", d: "Pick your role, skills, difficulty and target company. We tailor every question to you." },
  { n: "2", t: "Answer live", d: "Respond to timed prompts by voice or text while your coach tracks structure and depth." },
  { n: "3", t: "Get your report", d: "Receive a scored breakdown, strengths, gaps and a personalized 2-week roadmap." },
];

const glassPanel = { background: "#1f1f24" };
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

function FieldLabel({ children }) {
  return <label className="text-[11px] font-bold tracking-[.2em] text-[#cbc3d7] uppercase mb-3 block">{children}</label>;
}

function SkillTagField({ value, onChange, suggestions }) {
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

function CompanyField({ value, onChange, suggestions }) {
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
        placeholder="e.g. Google, Amazon…"
        autoComplete="off"
        className="w-full bg-transparent border-0 border-b border-[#494454] focus:border-[#d0bcff] outline-none text-[#e4e1e8] text-[15px] px-0 py-3 placeholder:text-[#6f6f7c] transition-colors"
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

function WorkflowItem({ done, dim, label, desc }) {
  const Icon = done ? SquareCheck : Square;
  return (
    <div className={`flex items-start gap-3 ${dim ? "opacity-50" : ""}`}>
      <Icon className={`w-4 h-4 flex-none mt-0.5 ${done ? "text-[#d0bcff]" : "text-[#494454]"}`} />
      <div>
        <p className={`text-[11px] font-bold tracking-[.15em] uppercase ${done ? "text-[#d0bcff]" : "text-[#e4e1e8]"}`}>{label}</p>
        <p className="text-[11px] text-[#958ea0] mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default function InterviewSetup() {
  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState("1–2 Years");
  const [difficulty, setDifficulty] = useState("Medium");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [launchingPreset, setLaunchingPreset] = useState(null);

  const router = useRouter();
  const { showToast } = useToast();

  const experienceIndex = Math.max(0, EXPERIENCE_TIERS.findIndex((t) => t.value === experience));
  const complexity = COMPLEXITY.find((c) => c.value === difficulty) || COMPLEXITY[1];

  const startInterview = async (overrides = {}) => {
    const payload = {
      role: overrides.role ?? role,
      experience: overrides.experience ?? experience,
      difficulty: overrides.difficulty ?? difficulty,
      skills: overrides.skills ?? skills,
      company: overrides.company ?? company,
    };

    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        showToast?.({ title: "couldn't start interview", description: data.message || "please try again.", type: "error" });
        return false;
      }

      router.push(`/interviewsession?id=${data.interviewId}`);
      return true;
    } catch (error) {
      console.error(error);
      showToast?.({ title: "something went wrong", description: "please try again.", type: "error" });
      return false;
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await startInterview();
    if (!ok) setSubmitting(false);
  };

  const handlePresetLaunch = async (preset) => {
    if (submitting || launchingPreset) return;
    setLaunchingPreset(preset.role);
    setRole(preset.role);
    setDifficulty(preset.difficulty);
    const ok = await startInterview({ role: preset.role, difficulty: preset.difficulty });
    if (!ok) setLaunchingPreset(null);
  };

  return (
    <div className="animate-rise flex flex-col gap-10">
      <div>
        <h1 className="font-display text-[28px] sm:text-[36px] text-[#e4e1e8] uppercase tracking-[.05em] flex items-center gap-3 m-0">
          {"// Start new interview "} <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#d0bcff] animate-blockcaret" />
        </h1>
        <p className="text-[14px] sm:text-[15px] leading-[1.7] text-[#cbc3d7] mt-3 max-w-2xl">
          Choose your role, skills, experience and difficulty we will tailor the interview questions to match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <form onSubmit={handleStart} className="min-w-0">
          <div className="p-6 sm:p-8 rounded-[4px] border border-[#494454] flex flex-col gap-8" style={glassPanel}>
            <div>
              <FieldLabel>{"// role"}</FieldLabel>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none bg-transparent border-0 border-b border-[#494454] focus:border-[#d0bcff] outline-none text-[#e4e1e8] font-display text-[20px] sm:text-[24px] px-0 py-3 pr-8 cursor-pointer transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-[#1f1f24] text-[#e4e1e8]">{r}</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-[#958ea0] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <FieldLabel>{"// skills (Add a few)"}</FieldLabel>
              <SkillTagField value={skills} onChange={setSkills} suggestions={SKILL_SUGGESTIONS} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-bold tracking-[.2em] text-[#cbc3d7] uppercase">{"// experience level"}</label>
                  <span className="font-display text-[13px] tracking-[.05em] text-[#d0bcff]">
                    {EXPERIENCE_TIERS[experienceIndex].label.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-1.5 h-3.5 mb-3">
                  {EXPERIENCE_TIERS.map((t, i) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setExperience(t.value)}
                      aria-label={t.value}
                      className="flex-1 transition-all duration-200 hover:brightness-125 hover:scale-y-125 cursor-pointer"
                      style={{ background: i <= experienceIndex ? "#d0bcff" : "#494454" }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] tracking-[.1em] uppercase text-[#6f6f7c]">
                  {EXPERIENCE_TIERS.map((t) => (
                    <span key={t.value}>{t.label}</span>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>{"// difficulty"}</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {COMPLEXITY.map((c) => {
                    const active = difficulty === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setDifficulty(c.value)}
                        className={`py-3 text-[11px] font-bold tracking-[.1em] uppercase transition-all duration-200 hover:scale-[1.03] border cursor-pointer ${
                          active ? "border-[#d0bcff] text-[#d0bcff]" : "border-[#494454] text-[#958ea0] hover:border-[#6f6f7c]"
                        }`}
                        style={active ? { background: "rgba(208,188,255,.1)", boxShadow: "0 0 12px 0 rgba(208,188,255,.15)" } : undefined}
                      >
                        {c.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>{"// target company (optional)"}</FieldLabel>
              <CompanyField value={company} onChange={setCompany} suggestions={COMPANY_SUGGESTIONS} />
            </div>

            <div className="pt-2 border-t border-[#494454] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="flex items-center gap-2.5 text-[12px] text-[#958ea0]">
                <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 animate-pulse" />
                ready to start
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#d0bcff] text-[#3c0091] text-[12px] font-bold tracking-[.2em] uppercase py-4 px-8 hover:bg-[#e9ddff] hover:scale-[1.03] transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
                style={ctaStyle}
              >
                {submitting ? "starting…" : "start interview »"}
              </button>
            </div>
          </div>
        </form>

        <div className="hidden lg:flex flex-col gap-6 sticky top-8">
          <div className="p-5 rounded-[4px] border border-[#494454]" style={glassPanel}>
            <h3 className="text-[11px] font-bold tracking-[.2em] text-[#e4e1e8] uppercase mb-5 flex items-center gap-2">
              <Workflow className="w-3.5 h-3.5 text-[#d0bcff]" /> {"// how it works"}
            </h3>
            <div className="space-y-4">
              <WorkflowItem done label="setup checked" desc="Your choices look good." />
              <WorkflowItem label="ai warming up" desc="Getting your interviewer ready." />
              <WorkflowItem dim label="connecting" desc="Waiting for the AI to be ready." />
            </div>
          </div>

          <div className="p-5 rounded-[4px] border border-[#494454]" style={glassPanel}>
            <h3 className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> {"// status"}
            </h3>
            <div className="space-y-2 text-[11px] leading-relaxed text-[#958ea0]">
              <p><span className="text-[#d0bcff]/70">[ok]</span> your profile is ready.</p>
              <p><span className="text-[#d0bcff]/70">[ok]</span> waiting for your choices.</p>
              <p><span className="text-[#a3c9ff]/70">[set]</span> role: &apos;{role}&apos;</p>
              <p><span className="text-[#a3c9ff]/70">[set]</span> difficulty: {complexity.value}</p>
              <p className="text-[#d0bcff] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 bg-[#d0bcff] animate-blockcaret flex-none" />
                ready when you are — click start below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4">{"// how your session works"}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="p-5 rounded-[4px] border border-[#494454]" style={glassPanel}>
              <span className="w-7 h-7 flex items-center justify-center font-display text-[13px] text-[#d0bcff] mb-3 border border-[#494454]">{s.n}</span>
              <div className="font-bold text-[13.5px] text-[#e4e1e8] mb-1.5">{s.t}</div>
              <div className="text-[12px] text-[#958ea0] leading-[1.6]">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4">{"// quick presets — one tap to launch"}</div>
        <div className="flex flex-wrap gap-3">
          {PRESETS.map((p) => {
            const isLaunching = launchingPreset === p.role;
            return (
              <button
                key={p.role}
                type="button"
                disabled={submitting || !!launchingPreset}
                onClick={() => handlePresetLaunch(p)}
                className="flex items-center gap-2.5 border border-[#494454] bg-[#1f1f24] px-4 py-3 rounded-[4px] text-[12.5px] text-[#e4e1e8] disabled:opacity-60 disabled:hover:scale-100 hover:border-[#6f6f7c] hover:bg-[#2a292e] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                {isLaunching ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-[#d0bcff] rounded-full animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.dot }} />
                )}
                <span className="font-bold">{p.role}</span>
                <span className="text-[9.5px] px-[7px] py-0.5 border border-[#494454] text-[#958ea0] uppercase tracking-[.4px]">{p.difficulty}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
