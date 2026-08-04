"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Robot, Card, fieldClass, labelClass, AutocompleteInput, SkillTagInput, SKILL_SUGGESTIONS, COMPANY_SUGGESTIONS } from "@/components/ui/Brand";

const PRESETS = [
  { role: "Full Stack Developer", difficulty: "Medium", dot: "#8b5cf6" },
  { role: "Backend Developer", difficulty: "Hard", dot: "#5b9be8" },
  { role: "Frontend Developer", difficulty: "Easy", dot: "#34d399" },
];

const STEPS = [
  { n: "1", t: "Configure", d: "Pick your role, skills, difficulty and target company. The engine tailors every question." },
  { n: "2", t: "Answer live", d: "Respond to timed prompts by voice or text while your coach tracks structure and depth." },
  { n: "3", t: "Get your report", d: "Receive a scored breakdown, strengths, gaps and a personalized 2-week roadmap." },
];

export default function InterviewSetup() {
  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState("1–2 Years");
  const [difficulty, setDifficulty] = useState("Medium");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [launchingPreset, setLaunchingPreset] = useState(null);

  const router = useRouter();

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
        alert(data.message);
        return false;
      }

      router.push(`/interviewsession?id=${data.interviewId}`);
      return true;
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
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
    <div className="animate-rise">
      <div className="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-6 items-center mb-8">
        <div className="order-1">
          <div className="inline-flex items-center gap-2 px-3 py-[5px] border border-purple/35 rounded-full text-[10.5px] text-purple-lilac mb-2.5 uppercase tracking-[.5px]" style={{ background: "rgba(139,92,246,.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple animate-glowpulse" />engine v2.5 active
          </div>
          <h1 className="font-extrabold text-[26px] sm:text-[30px] tracking-[-1px] mb-3">Configure your session</h1>
          <p className="text-[#8a8a97] text-[13px] leading-[1.7] max-w-[560px] mb-4">
            Set the parameters below and I&apos;ll curate contextual questions tuned to your background, target role and company vibe.
          </p>

          <div className="relative h-[220px] lg:h-[280px] hidden lg:flex items-center justify-center">
            <div className="absolute w-[280px] h-[280px] rounded-full animate-glowpulse" style={{ background: "radial-gradient(circle,rgba(139,92,246,.4),rgba(91,155,232,.14) 55%,transparent 68%)", filter: "blur(18px)" }} />
            <Robot v="b" className="w-[220px] h-auto relative z-[2] animate-floaty" />
          </div>
        </div>

        <div className="order-2">
          <form onSubmit={handleStart}>
            <Card className="p-[22px] sm:p-[26px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px] mb-[18px]">
                <div>
                  <div className={labelClass}>TARGET ROLE</div>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
                    <option>Full Stack Developer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Python Developer</option>
                  </select>
                </div>
                <div>
                  <div className={labelClass}>CORE SKILLS FOCUS</div>
                  <SkillTagInput value={skills} onChange={setSkills} suggestions={SKILL_SUGGESTIONS} placeholder="type" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px] mb-6">
                <div>
                  <div className={labelClass}>EXPERIENCE</div>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} className={fieldClass}>
                    <option>Fresher</option>
                    <option>1–2 Years</option>
                    <option>3+ Years</option>
                  </select>
                </div>
                <div>
                  <div className={labelClass}>DIFFICULTY</div>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={fieldClass}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <div className={labelClass}>TARGET COMPANY</div>
                  <AutocompleteInput value={company} onChange={setCompany} suggestions={COMPANY_SUGGESTIONS} placeholder="type" />
                </div>
              </div>

              <div className="border-t border-white/[.07] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="flex items-center gap-2.5 text-[12px] text-[#8a8a97]">
                  <span className="w-[7px] h-[7px] rounded-full bg-good" />questions ready to stream
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto border-0 text-white px-[26px] py-[13px] rounded-xl text-[14px] font-semibold disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 10px 28px rgba(124,58,237,.36)" }}
                >
                  {submitting ? "Starting…" : "Start interview →"}
                </button>
              </div>
            </Card>
          </form>
        </div>
      </div>

      <div className="text-[11px] text-purple tracking-[.8px] uppercase mb-[14px]">// how your session works</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        {STEPS.map((s) => (
          <Card key={s.n} className="p-5">
            <span className="w-7 h-7 rounded-[9px] flex items-center justify-center font-extrabold text-[13px] text-purple-light mb-3" style={{ background: "rgba(139,92,246,.16)" }}>{s.n}</span>
            <div className="font-semibold text-[13.5px] mb-1.5">{s.t}</div>
            <div className="text-[12px] text-[#8a8a97] leading-[1.6]">{s.d}</div>
          </Card>
        ))}
      </div>

      <div className="text-[11px] text-purple tracking-[.8px] uppercase mb-[14px]">// quick presets — one tap to launch</div>
      <div className="flex flex-wrap gap-2.5">
        {PRESETS.map((p) => {
          const isLaunching = launchingPreset === p.role;
          return (
            <button
              key={p.role}
              type="button"
              disabled={submitting || !!launchingPreset}
              onClick={() => handlePresetLaunch(p)}
              className="flex items-center gap-2 bg-panel border border-white/[.07] px-4 py-3 rounded-xl text-[12.5px] text-[#e6e6ec] disabled:opacity-60"
            >
              {isLaunching ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-purple-light rounded-full animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.dot }} />
              )}
              <span className="font-semibold">{p.role}</span>
              <span className="text-[9.5px] px-[7px] py-0.5 rounded-md bg-field text-[#9090a0] uppercase tracking-[.4px]">{p.difficulty}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
