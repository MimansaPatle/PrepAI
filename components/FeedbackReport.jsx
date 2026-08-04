"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
import { Download, CheckCircle2, TrendingUp, ChevronRight, Plus } from "lucide-react";
import { generateInterviewPDF } from "@/lib/generateInterviewPDF";
import { Robot, Card } from "@/components/ui/Brand";

export default function FeedbackReport() {
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadFeedback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const interviewId = params.get("id");

        const res = await fetch(`/api/interview/${interviewId}`);
        const data = await res.json();

        if (!data.success) {
          alert(data.message);
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

  if (loading) {
    return (
      <div className="min-h-[58vh] flex flex-col items-center justify-center text-center animate-rise">
        <Robot v="a" className="w-[110px] h-auto animate-bob mb-6" />
        <p className="text-[#8a8a97] text-[13px] tracking-[.3px]">generating ai feedback…</p>
      </div>
    );
  }

  if (!feedback || feedback.score == null) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-bad text-[13px]">
        Feedback not available.
      </div>
    );
  }

  const scoreColor = feedback.score >= 80 ? "#34d399" : feedback.score >= 60 ? "#a78bfa" : "#f87171";
  const circleDeg = Math.max(0, Math.min(360, (feedback.score / 100) * 360));

  const metrics = [
    { label: "Communication", score: feedback?.metrics?.communication?.score ?? 0, reason: feedback?.metrics?.communication?.reason ?? "", color: "#5b9be8" },
    { label: "Technical knowledge", score: feedback?.metrics?.technicalKnowledge?.score ?? 0, reason: feedback?.metrics?.technicalKnowledge?.reason ?? "", color: "#8b5cf6" },
    { label: "Confidence", score: feedback?.metrics?.confidence?.score ?? 0, reason: feedback?.metrics?.confidence?.reason ?? "", color: "#a78bfa" },
    { label: "Problem solving", score: feedback?.metrics?.problemSolving?.score ?? 0, reason: feedback?.metrics?.problemSolving?.reason ?? "", color: "#34d399" },
  ];

  return (
    <div className="animate-rise">
      <div className="flex items-center justify-between mb-[22px] gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Robot v="a" className="w-14 h-auto animate-bob" />
          <div>
            <h1 className="font-extrabold text-[24px] sm:text-[26px] mb-[5px] tracking-[-.8px]">Interview report</h1>
            <p className="text-[#8a8a97] text-[12.5px]">{interview?.role} / {(interview?.difficulty || "").toLowerCase()} / completed {interview?.completedAt ? new Date(interview.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
          </div>
        </div>
        <button
          onClick={() => generateInterviewPDF(interview)}
          className="inline-flex items-center gap-2 border-0 text-white px-5 py-[11px] rounded-[11px] text-[13px] font-semibold"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
        >
          <Download className="w-3.5 h-3.5" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-[18px] mb-[18px]">
        <Card className="p-[26px] text-center">
          <div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-4">OVERALL PERFORMANCE</div>
          <div className="w-[148px] h-[148px] mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${scoreColor} 0deg ${circleDeg}deg,#16161e ${circleDeg}deg)` }}>
            <div className="w-[114px] h-[114px] rounded-full bg-panel flex flex-col items-center justify-center">
              <span className="font-extrabold text-[36px]" style={{ color: scoreColor }}>
                <CountUp end={feedback.score} duration={1.4} suffix="%" />
              </span>
              <span className="text-[10px] text-[#7a7a87]">readiness</span>
            </div>
          </div>
          <div className="text-[13px] font-semibold mb-1.5" style={{ color: scoreColor }}>{feedback.recommendation || "—"}</div>
          <div className="text-[11.5px] text-[#8a8a97] leading-[1.5]">{feedback.summary}</div>
        </Card>

        <Card className="p-[22px] sm:p-[26px]">
          <div className="font-semibold text-[15px] mb-5">Competency breakdown</div>
          {metrics.map((c) => {
            const pct = Math.max(0, Math.min(100, (c.score / 5) * 100));
            return (
              <div key={c.label} className="mb-[17px]">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-[#c4c4cf]">{c.label}</span>
                  <span className="font-extrabold" style={{ color: c.color }}>{c.score}/5</span>
                </div>
                <div className="h-2 bg-field rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c.color }} />
                </div>
                {c.reason && <div className="text-[11px] text-[#6f6f7c] mt-1.5 leading-[1.5]">{c.reason}</div>}
              </div>
            );
          })}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px] mb-[18px]">
        <div className="p-[22px] bg-panel border border-good/20 rounded-[18px]">
          <div className="flex items-center gap-1.5 font-semibold text-[14px] text-good mb-3.5"><CheckCircle2 className="w-4 h-4" /> strengths</div>
          {feedback?.strengths?.length ? feedback.strengths.map((s, i) => (
            <div key={i} className="flex gap-[11px] py-[7px] text-[12.5px] leading-[1.5] text-[#c4c4cf]"><Plus className="w-3.5 h-3.5 text-good flex-none mt-0.5" />{s}</div>
          )) : <div className="text-[12px] text-[#6f6f7c]">AI did not identify any strengths.</div>}
        </div>
        <div className="p-[22px] bg-panel border border-purple/20 rounded-[18px]">
          <div className="flex items-center gap-1.5 font-semibold text-[14px] text-purple-light mb-3.5"><TrendingUp className="w-4 h-4" /> areas to improve</div>
          {feedback?.weaknesses?.length ? feedback.weaknesses.map((w, i) => (
            <div key={i} className="flex gap-[11px] py-[7px] text-[12.5px] leading-[1.5] text-[#c4c4cf]"><ChevronRight className="w-3.5 h-3.5 text-purple-light flex-none mt-0.5" />{w}</div>
          )) : <div className="text-[12px] text-[#6f6f7c]">AI did not identify any weaknesses.</div>}
        </div>
      </div>

      {feedback?.roadmap?.length > 0 && (
        <Card className="p-[22px] sm:p-[24px] mb-[18px]">
          <div className="font-semibold text-[15px] mb-5">// your 2-week roadmap</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {feedback.roadmap.map((r, i) => (
              <div key={i} className="p-[17px] bg-field rounded-[14px]">
                <div className="w-7 h-7 rounded-[9px] flex items-center justify-center font-extrabold text-[13px] text-purple-light mb-3" style={{ background: "rgba(139,92,246,.16)" }}>{i + 1}</div>
                <div className="text-[10.5px] uppercase tracking-[.4px] text-purple-lilac mb-1">{r.day}</div>
                <div className="text-[13px] font-semibold mb-1.5">{r.topic}</div>
                <div className="text-[11.5px] text-[#8a8a97] leading-[1.5]">{r.goal}</div>
                {r.resource && <a href={r.resource} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[11px] text-purple-light">open resource →</a>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mb-[22px]">
        <div className="text-[11px] text-purple tracking-[.8px] uppercase mb-[14px]">// interview analysis</div>
        {answers.length === 0 ? (
          <Card className="p-6 text-center text-[#7a7a87] text-[13px]">No interview questions found.</Card>
        ) : (
          <div className="space-y-3.5">
            {answers.map((item, index) => {
              const qf = feedback?.questionFeedback?.[index];
              const qColor = qf?.score >= 8 ? "#34d399" : qf?.score >= 5 ? "#a78bfa" : "#f87171";
              return (
                <Card key={index} className="overflow-hidden">
                  <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-white/[.07] bg-field">
                    <span className="text-[10.5px] uppercase tracking-[.5px] text-purple-lilac">question {index + 1}</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${qColor}22`, color: qColor }}>
                      {qf ? `${qf.score}/10` : "Not evaluated"}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-[10px] uppercase tracking-[.5px] text-[#7a7a87] mb-2">interview question</div>
                    <p className="text-[14px] font-medium leading-[1.6] text-[#e6e6ec]">{item.question}</p>
                  </div>
                  <div className="px-5 sm:px-6 pb-6">
                    <div className="bg-field rounded-xl border border-white/[.06] p-4 sm:p-5">
                      <div className="text-[10px] uppercase tracking-[.5px] text-good mb-2.5">your answer</div>
                      <p className="text-[#c4c4cf] text-[13px] whitespace-pre-wrap leading-[1.7]">{item.answer || "No answer submitted."}</p>

                      {qf && (
                        <div className="mt-5 space-y-4">
                          {qf.strengths?.length > 0 && (
                            <div>
                              <div className="text-good font-semibold text-[12px] mb-1.5">AI strengths</div>
                              <ul className="space-y-1">
                                {qf.strengths.map((p, i) => <li key={i} className="text-[12px] text-[#c4c4cf]">• {p}</li>)}
                              </ul>
                            </div>
                          )}
                          {qf.weaknesses?.length > 0 && (
                            <div>
                              <div className="text-bad font-semibold text-[12px] mb-1.5">AI weaknesses</div>
                              <ul className="space-y-1">
                                {qf.weaknesses.map((p, i) => <li key={i} className="text-[12px] text-[#c4c4cf]">• {p}</li>)}
                              </ul>
                            </div>
                          )}
                          {qf.idealAnswer && (
                            <div>
                              <div className="text-purple-light font-semibold text-[12px] mb-1.5">Ideal answer</div>
                              <div className="bg-panel border border-white/[.06] rounded-xl p-3.5 text-[12px] text-[#c4c4cf] leading-[1.7]">{qf.idealAnswer}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={() => router.push("/interview")} className="border-0 text-white px-6 py-3 rounded-xl text-[13.5px] font-semibold" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
          Practice again
        </button>
        <button onClick={() => router.push("/dashboard")} className="bg-field border border-white/[.1] text-[#f2f2f5] px-6 py-3 rounded-xl text-[13.5px]">
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
