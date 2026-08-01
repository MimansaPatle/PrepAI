"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Sparkles, Briefcase, GraduationCap, Flame, Code, Building } from "lucide-react";

export default function InterviewSetup() {
  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState("1–2 Years");
  const [difficulty, setDifficulty] = useState("Medium");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");

  const router = useRouter();

  const handleStart = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/interview/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        experience,
        difficulty,
        skills,
        company,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    router.push(`/interviewsession?id=${data.interviewId}`);

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 text-zinc-100 font-sans">
      <div className="w-full max-w-4xl space-y-8 animate-fadeIn">
        
        {/* Header Section */}
        <header className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            PrepAI Engine v2.5 Active
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-100 sm:text-5xl">
            Instantiate Target Session 🚀
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Configure parameters below to activate your tailored AI technical interviewer. 
            Your virtual coach will curate contextual questions based on your background.
          </p>
        </header>

        {/* Configuration Form */}
        <form onSubmit={handleStart} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-10 space-y-8 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1 - Basic Options */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  Target Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-zinc-200 cursor-pointer hover:border-zinc-700"
                >
                  <option className="bg-zinc-950 text-zinc-200">Full Stack Developer</option>
                  <option className="bg-zinc-950 text-zinc-200">Frontend Developer</option>
                  <option className="bg-zinc-950 text-zinc-200">Backend Developer</option>
                  <option className="bg-zinc-950 text-zinc-200">Python Developer</option>
                </select>
              </div>

              {/* Multi-Selection row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                    <GraduationCap className="w-4 h-4 text-violet-400" />
                    Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-zinc-200 cursor-pointer hover:border-zinc-700"
                  >
                    <option className="bg-zinc-950 text-zinc-200">Fresher</option>
                    <option className="bg-zinc-950 text-zinc-200">1–2 Years</option>
                    <option className="bg-zinc-950 text-zinc-200">3+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                    <Flame className="w-4 h-4 text-violet-400" />
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-zinc-200 cursor-pointer hover:border-zinc-700"
                  >
                    <option className="bg-zinc-950 text-zinc-200">Easy</option>
                    <option className="bg-zinc-950 text-zinc-200">Medium</option>
                    <option className="bg-zinc-950 text-zinc-200">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Column 2 - Focus Targets */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                  <Code className="w-4 h-4 text-violet-400" />
                  Core Skills Focus
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Next.js, MongoDB"
                  className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-zinc-200 placeholder-zinc-700 hover:border-zinc-800"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                  <Building className="w-4 h-4 text-violet-400" />
                  Target Company Vibe
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., TCS, Amazon, Google"
                  className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-zinc-200 placeholder-zinc-700 hover:border-zinc-800"
                />
              </div>
            </div>

          </div>

          {/* Action Panel Footer */}
          <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Dynamic Mock Questions ready to stream
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-zinc-100 font-semibold px-10 py-4 rounded-xl transition-all shadow-xl shadow-violet-950/50 active:scale-[0.98] focus:ring-2 focus:ring-violet-500/40"
            >
              Start AI Interview Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}