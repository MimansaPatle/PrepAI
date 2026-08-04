"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Brand";

export default function AdminInterviewDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const res = await fetch(`/api/admin/interviews/${params.id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load interview.");
          return;
        }

        setInterview(data.interview);
      } catch (error) {
        console.error("Failed to load interview:", error);
        setError("Something went wrong while loading the interview.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadInterview();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-[58vh] flex items-center justify-center text-[#7a7a87] text-[13px]">Loading interview…</div>;
  }

  if (error || !interview) {
    return (
      <div className="min-h-[58vh] flex flex-col items-center justify-center gap-4">
        <p className="text-bad text-[13px]">{error || "Interview not found."}</p>
        <button onClick={() => router.push("/admin/interviews")} className="text-[13px] text-purple-light">← Back to interviews</button>
      </div>
    );
  }

  const feedback = interview.feedback || {};
  const metrics = feedback.metrics || {};
  const questionFeedback = feedback.questionFeedback || [];
  const roadmap = feedback.roadmap || [];

  const metricCards = [
    { label: "Communication", data: metrics.communication },
    { label: "Technical knowledge", data: metrics.technicalKnowledge },
    { label: "Confidence", data: metrics.confidence },
    { label: "Problem solving", data: metrics.problemSolving },
  ];

  return (
    <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise space-y-8">
      <button onClick={() => router.push("/admin/interviews")} className="inline-flex items-center gap-2 text-[12.5px] text-[#7a7a87]">
        ← back to interviews
      </button>

      <div className="border-b border-white/[.07] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-[13px] flex-none" style={{ background: "linear-gradient(135deg,#8b5cf6,#5b9be8)" }} />
            <div>
              <p className="text-[10px] uppercase tracking-[.5px] text-purple-light">interview review</p>
              <h1 className="text-[24px] sm:text-[26px] font-extrabold mt-1 tracking-[-.6px]">{interview.user?.name || "Unknown user"}</h1>
              <p className="text-[12.5px] text-[#7a7a87] mt-1">{interview.user?.email}</p>
            </div>
          </div>
          <span
            className="text-[11px] px-3 py-1.5 rounded-full border self-start"
            style={
              interview.status === "completed"
                ? { background: "rgba(52,211,153,.1)", color: "#34d399", borderColor: "rgba(52,211,153,.2)" }
                : { background: "rgba(139,92,246,.12)", color: "#c4b5fd", borderColor: "rgba(139,92,246,.24)" }
            }
          >
            {interview.status}
          </span>
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <InfoCard label="Score" value={feedback.score !== undefined ? `${feedback.score}%` : "—"} />
        <InfoCard label="Role" value={interview.role || "—"} />
        <InfoCard label="Difficulty" value={interview.difficulty || "—"} />
        <InfoCard label="Experience" value={interview.experience || "—"} />
        <InfoCard label="Company" value={interview.company || "—"} />
      </section>

      <section>
        <SectionTitle title="Evaluation metrics" description="AI assessment across core interview dimensions." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {metricCards.map((m) => (
            <MetricCard key={m.label} label={m.label} score={m.data?.score} reason={m.data?.reason} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Questions & answers" description="Question-level AI evaluation of the candidate." />
        <div className="space-y-4 mt-5">
          {questionFeedback.length === 0 ? (
            <Card className="p-6 text-[#7a7a87] text-[13px]">No question-level feedback available.</Card>
          ) : (
            questionFeedback.map((item, index) => (
              <Card key={item._id || index} className="overflow-hidden">
                <div className="p-5 border-b border-white/[.07]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10.5px] text-purple-light font-mono mb-2 uppercase tracking-[.4px]">question {index + 1}</p>
                      <h3 className="text-[14px] font-semibold text-[#e6e6ec] leading-relaxed">{item.question}</h3>
                    </div>
                    <span className="shrink-0 bg-field border border-white/[.08] rounded-lg px-3 py-1 text-[13px] font-mono">{item.score ?? 0}</span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <AnswerBlock title="Candidate answer" text={item.candidateAnswer} />
                  <AnswerBlock title="Ideal answer" text={item.idealAnswer} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <ListBlock title="Strengths" items={item.strengths} good />
                    <ListBlock title="Weaknesses" items={item.weaknesses} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <SectionTitle title="Overall AI feedback" description="Final assessment generated from the complete interview." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          <Card className="p-5">
            <div className="text-[13px] font-semibold text-purple-light mb-2.5">Summary</div>
            <p className="text-[12.5px] text-[#9090a0] leading-relaxed">{feedback.summary || "No summary available."}</p>
          </Card>
          <Card className="p-5">
            <div className="text-[13px] font-semibold text-good mb-2.5">Recommendation</div>
            <p className="text-[12.5px] text-[#9090a0] leading-relaxed">{feedback.recommendation || "No recommendation available."}</p>
          </Card>
        </div>
      </section>

      {roadmap.length > 0 && (
        <section>
          <SectionTitle title="Improvement roadmap" description="AI-generated learning plan for improving future interview performance." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
            {roadmap.map((item, index) => (
              <Card key={item._id || index} className="p-[18px]">
                <p className="text-[10.5px] font-mono uppercase tracking-[.4px] text-purple-light">{item.day}</p>
                <h3 className="font-semibold mt-2 text-[13.5px] text-[#e6e6ec]">{item.topic}</h3>
                <p className="text-[12px] text-[#8a8a97] mt-2 leading-relaxed">{item.goal}</p>
                {item.resource && (
                  <a href={item.resource} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[11.5px] text-purple-light">
                    open resource →
                  </a>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-[9.5px] uppercase tracking-[.5px] text-[#7a7a87]">{label}</p>
      <p className="text-[13px] font-semibold text-[#e6e6ec] mt-2 break-words">{value}</p>
    </Card>
  );
}

function MetricCard({ label, score, reason }) {
  const normalizedScore = Math.max(0, Math.min(Number(score) || 0, 10));
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[13.5px] text-[#e6e6ec]">{label}</h3>
        <span className="font-mono text-purple-light text-[13px]">{normalizedScore}/10</span>
      </div>
      <div className="w-full h-1.5 bg-field rounded-full mt-3.5 overflow-hidden">
        <div className="h-full bg-purple rounded-full transition-all" style={{ width: `${normalizedScore * 10}%` }} />
      </div>
      <p className="text-[11.5px] text-[#7a7a87] mt-3.5 leading-relaxed">{reason || "No evaluation reason available."}</p>
    </Card>
  );
}

function AnswerBlock({ title, text }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[.4px] text-[#7a7a87] mb-2">{title}</p>
      <div className="bg-field border border-white/[.06] rounded-xl p-3.5 text-[12.5px] text-[#9090a0] leading-relaxed">{text || "No answer available."}</div>
    </div>
  );
}

function ListBlock({ title, items = [], good }) {
  return (
    <div className="bg-field border border-white/[.06] rounded-xl p-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        {good ? <CheckCircle2 className="w-3.5 h-3.5 text-good" /> : <AlertTriangle className="w-3.5 h-3.5 text-purple-light" />}
        <p className="text-[10.5px] font-semibold uppercase tracking-[.4px] text-[#9090a0]">{title}</p>
      </div>
      {items?.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item, index) => <li key={index} className="text-[11.5px] text-[#7a7a87] leading-relaxed">• {item}</li>)}
        </ul>
      ) : (
        <p className="text-[11.5px] text-[#5c5c68]">None recorded.</p>
      )}
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="text-[18px] font-bold text-[#e6e6ec]">{title}</h2>
      <p className="text-[12.5px] text-[#7a7a87] mt-1">{description}</p>
    </div>
  );
}
