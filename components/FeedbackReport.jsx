"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download, ArrowRight, ChevronDown } from "lucide-react";
import { generateInterviewPDF } from "@/lib/generateInterviewPDF";
import FeedbackSkeleton from "@/components/FeedbackSkeleton";
import { useToast } from "@/components/ui/ToastProvider";

const EXP_LABEL = { "Fresher": "entry-level", "1–2 Years": "mid-level", "3+ Years": "senior" };

function relativeTime(date) {
  if (!date) return "—";
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function bandColor(score, max) {
  const pct = (score / max) * 100;
  if (pct >= 80) return "#34d399";
  if (pct >= 60) return "#a3c9ff";
  return "#ffb4ab";
}

function QuestionRow({ index, item, qf }) {
  const [open, setOpen] = useState(false);
  const score = qf?.score ?? null;
  const color = score == null ? "#494454" : bandColor(score, 10);
  const filled = score == null ? 0 : Math.max(0, Math.min(5, Math.round((score / 10) * 5)));

  return (
    <div className="border-b border-[#494454]/20 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-[#0e0e12]/50 transition-colors duration-200 text-left cursor-pointer"
      >
        <div className="flex items-start md:items-center gap-6 flex-1 min-w-0">
          <span className="font-display text-[24px] text-[#cbc3d7]/40 w-8 text-right flex-none">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[14px] text-[#e4e1e8]/90 flex-1 min-w-0">{item.question}</span>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-end flex-none">
          <div className="flex gap-1 h-1.5 w-32 flex-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-full flex-1" style={{ background: i < filled ? color : "#353439" }} />
            ))}
          </div>
          <span className="w-12 text-right text-[12px] font-bold flex-none" style={{ color }}>{score != null ? `${score}/10` : "—"}</span>
          <ChevronDown className={`w-4 h-4 text-[#6f6f7c] flex-none transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-5 pl-4 md:pl-[68px]">
          <div className="border border-[#494454]/40 bg-[#0e0e12] p-4">
            <div className="text-[9.5px] uppercase tracking-[.15em] text-[#6f6f7c] mb-2">your answer</div>
            <p className="text-[12.5px] text-[#cbc3d7] leading-[1.7] whitespace-pre-wrap">{item.answer || "No answer submitted."}</p>

            {qf && (
              <div className="mt-4 space-y-3.5">
                {qf.strengths?.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[.1em] text-[#34d399] mb-1.5">strengths</div>
                    <ul className="space-y-1">
                      {qf.strengths.map((p, i) => <li key={i} className="text-[12px] text-[#cbc3d7]">— {p}</li>)}
                    </ul>
                  </div>
                )}
                {qf.weaknesses?.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[.1em] text-[#ffb4ab] mb-1.5">weaknesses</div>
                    <ul className="space-y-1">
                      {qf.weaknesses.map((p, i) => <li key={i} className="text-[12px] text-[#cbc3d7]">— {p}</li>)}
                    </ul>
                  </div>
                )}
                {qf.idealAnswer && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[.1em] text-[#d0bcff] mb-1.5">ideal answer</div>
                    <div className="border border-[#494454]/40 bg-[#1f1f24] p-3 text-[12px] text-[#cbc3d7] leading-[1.7]">{qf.idealAnswer}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeedbackReport() {
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadFeedback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const interviewId = params.get("id");

        const res = await fetch(`/api/interview/${interviewId}`);
        const data = await res.json();

        if (!data.success) {
          showToast?.({ title: "couldn't load feedback", description: data.message || "please try again.", type: "error" });
          return;
        }

        const interview = data.interview;
        setInterview(interview);
        setAnswers(interview.questions);
        setFeedback(interview.feedback);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, []);

  const handleRetry = async () => {
    if (!interview || retrying) return;
    setRetrying(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interview.role,
          experience: interview.experience,
          difficulty: interview.difficulty,
          skills: interview.skills,
          company: interview.company,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast?.({ title: "couldn't start retry", description: data.message || "please try again.", type: "error" });
        setRetrying(false);
        return;
      }
      router.push(`/interviewsession?id=${data.interviewId}`);
    } catch (err) {
      console.error(err);
      showToast?.({ title: "something went wrong", description: "please try again.", type: "error" });
      setRetrying(false);
    }
  };

  if (loading) {
    return <FeedbackSkeleton />;
  }

  if (!feedback || feedback.score == null) {
    return (
      <div className="h-screen flex items-center justify-center dot-matrix-fine" style={{ background: "#131317" }}>
        <p className="text-[13px] text-[#ffb4ab]">feedback not available.</p>
      </div>
    );
  }

  const scoreColor = bandColor(feedback.score, 100);
  const circumference = 339.29;
  const dashOffset = circumference - (Math.max(0, Math.min(100, feedback.score)) / 100) * circumference;

  const metrics = [
    { label: "communication", score: feedback?.metrics?.communication?.score ?? 0 },
    { label: "technical", score: feedback?.metrics?.technicalKnowledge?.score ?? 0 },
    { label: "confidence", score: feedback?.metrics?.confidence?.score ?? 0 },
    { label: "problem solving", score: feedback?.metrics?.problemSolving?.score ?? 0 },
  ];

  const totalWords = answers.reduce((sum, a) => sum + (a.answer ? a.answer.trim().split(/\s+/).filter(Boolean).length : 0), 0);
  const expLabel = EXP_LABEL[interview?.experience] || (interview?.experience || "").toLowerCase();

  return (
    <div className="min-h-screen md:h-screen flex flex-col overflow-visible md:overflow-hidden" style={{ background: "#131317" }}>
      <div className="dot-matrix-fine fixed inset-0 pointer-events-none" />

      <header className="flex-none sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b border-[#494454] backdrop-blur-md" style={{ background: "rgba(14,14,18,.9)" }}>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[12px] font-bold tracking-[.2em] text-[#cbc3d7] hover:text-[#d0bcff] transition-colors duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> dashboard
        </button>

        <div className="hidden md:block text-[10px] tracking-[.2em] text-[#cbc3d7]/50">
          {(interview?.difficulty || "").toLowerCase()} &middot; {(interview?.role || "").toLowerCase()} &middot; {relativeTime(interview?.completedAt)}
        </div>

        <button
          onClick={() => generateInterviewPDF(interview)}
          className="flex items-center gap-2 text-[12px] font-bold tracking-[.2em] text-[#cbc3d7] hover:text-[#d0bcff] transition-colors duration-200 cursor-pointer"
        >
          <Download className="w-4 h-4" /> export pdf
        </button>
      </header>

      <div className="relative flex flex-1 flex-col md:flex-row overflow-visible md:overflow-hidden w-full">
        <aside className="w-full md:w-[420px] flex-none border-r border-[#494454] flex flex-col items-center justify-center p-8 lg:p-12 relative md:overflow-y-auto" style={{ background: "#0e0e12" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "rgba(208,188,255,.05)", filter: "blur(80px)" }} />

          <h2 className="relative text-[12px] font-bold uppercase tracking-[.3em] text-[#d0bcff] mb-16 whitespace-nowrap">{"// interview complete"}</h2>

          <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-16 flex-none">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#353439" strokeWidth="4" />
              <circle
                cx="60" cy="60" r="54" fill="none" stroke={scoreColor} strokeWidth="6"
                strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="square"
                style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 12px ${scoreColor}66)` }}
              />
            </svg>
            <div className="text-center z-10 flex flex-col items-center">
              <span className="font-display text-[64px] leading-none text-[#e4e1e8] tracking-tight">
                <CountUp end={feedback.score} duration={1.2} />
              </span>
              <span className="text-[12px] font-bold tracking-[.2em] text-[#cbc3d7]/70 mt-1">/ 100 overall</span>
            </div>
          </div>

          <div className="relative text-center mb-16 w-full">
            <div className="font-display text-[24px] text-[#e4e1e8] mb-3 tracking-tight lowercase">{feedback.recommendation?.toLowerCase() || "—"}.</div>
            <div className="text-[14px] text-[#cbc3d7]">for {expLabel} {interview?.role?.toLowerCase()} roles</div>
          </div>

          <div className="relative grid grid-cols-2 gap-x-8 gap-y-7 w-full max-w-[300px] border-t border-[#494454]/30 pt-8">
            {metrics.map((m) => {
              const color = bandColor(m.score, 5);
              return (
                <div key={m.label} className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#cbc3d7]/70 mb-3">{m.label}</div>
                  <div className="font-display text-[32px]" style={{ color, filter: `drop-shadow(0 0 8px ${color}4d)` }}>{m.score}<span className="text-[13px] text-[#6f6f7c]">/5</span></div>
                </div>
              );
            })}
          </div>
          <div className="relative mt-6 text-[10.5px] text-[#6f6f7c] tracking-[.1em] uppercase">{totalWords.toLocaleString()} words answered</div>
        </aside>

        <main className="flex-1 md:overflow-y-auto p-6 md:p-12 lg:p-16 xl:p-24" style={{ background: "#131317" }}>
          <div className="max-w-4xl mx-auto space-y-20">
            <section>
              <h3 className="text-[12px] font-bold uppercase tracking-[.2em] text-[#a3c9ff] mb-6">{"// what worked"}</h3>
              <div className="space-y-3">
                {feedback?.strengths?.length ? feedback.strengths.map((s, i) => (
                  <div key={i} className="border border-[#494454]/50 p-5 flex items-start gap-4 hover:bg-[#1f1f24] transition-colors duration-200 group" style={{ background: "#1b1b20" }}>
                    <span className="text-[#a3c9ff] font-bold flex-none group-hover:drop-shadow-[0_0_8px_rgba(163,201,255,0.5)]">+</span>
                    <p className="text-[14px] text-[#e4e1e8]/90">{s}</p>
                  </div>
                )) : <div className="text-[12px] text-[#6f6f7c]">no strengths identified.</div>}
              </div>
            </section>

            <section>
              <h3 className="text-[12px] font-bold uppercase tracking-[.2em] text-[#ffb4ab] mb-6">{"// what to fix"}</h3>
              <div className="space-y-3">
                {feedback?.weaknesses?.length ? feedback.weaknesses.map((w, i) => (
                  <div key={i} className="border border-[#494454]/50 p-5 flex items-start gap-4 hover:bg-[#1f1f24] transition-colors duration-200 group" style={{ background: "#1b1b20" }}>
                    <span className="text-[#ffb4ab] font-bold flex-none group-hover:drop-shadow-[0_0_8px_rgba(255,180,171,0.5)]">!</span>
                    <p className="text-[14px] text-[#e4e1e8]/90">{w}</p>
                  </div>
                )) : <div className="text-[12px] text-[#6f6f7c]">no weaknesses identified.</div>}
              </div>
            </section>

            <section className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#494454]/30">
              <button
                onClick={() => router.push("/interview")}
                className="bg-[#d0bcff] text-[#3c0091] text-[12px] font-bold tracking-[.2em] px-8 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-[#e9ddff] transition-all duration-200 cursor-pointer group"
                style={{ boxShadow: "0 0 20px 0 rgba(208,188,255,.2)" }}
              >
                drill my weak spots <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="bg-transparent border border-[#494454] text-[#e4e1e8] text-[12px] font-bold tracking-[.2em] px-8 py-4 rounded-full hover:bg-[#2a292e] transition-colors duration-200 disabled:opacity-60 cursor-pointer"
              >
                {retrying ? "starting…" : "retry interview"}
              </button>
            </section>

            <section>
              <h3 className="text-[12px] font-bold uppercase tracking-[.2em] text-[#d0bcff] mb-10">{"// question-by-question"}</h3>
              {answers.length === 0 ? (
                <div className="text-[13px] text-[#6f6f7c] p-6 text-center border border-[#494454]/30">no interview questions found.</div>
              ) : (
                <div>
                  {answers.map((item, index) => (
                    <QuestionRow key={index} index={index} item={item} qf={feedback?.questionFeedback?.[index]} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
