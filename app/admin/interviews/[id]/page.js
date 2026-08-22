"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Panel, Tag, Avatar } from "@/components/AdminUI";

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
    return <div className="min-h-[58vh] flex items-center justify-center text-[#6f6f7c] text-[13px]">loading interview…</div>;
  }

  if (error || !interview) {
    return (
      <div className="min-h-[58vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#ffb4ab] text-[13px]">{error || "Interview not found."}</p>
        <button onClick={() => router.push("/admin/interviews")} className="text-[12px] font-bold uppercase tracking-[.2em] text-[#d0bcff] cursor-pointer">← back to interviews</button>
      </div>
    );
  }

  const feedback = interview.feedback || {};
  const metrics = feedback.metrics || {};
  const questionFeedback = feedback.questionFeedback || [];
  const roadmap = feedback.roadmap || [];

  const metricCards = [
    { label: "communication", data: metrics.communication },
    { label: "technical knowledge", data: metrics.technicalKnowledge },
    { label: "confidence", data: metrics.confidence },
    { label: "problem solving", data: metrics.problemSolving },
  ];

  return (
    <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise space-y-10">
      <button onClick={() => router.push("/admin/interviews")} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#958ea0] hover:text-[#e4e1e8] cursor-pointer transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> back to interviews
      </button>

      <div className="border-b border-[#494454] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 border border-[#494454] flex items-center justify-center flex-none font-display text-[18px] text-[#d0bcff]">
              {(interview.user?.name || "?").trim().charAt(0).toUpperCase() || "?"}
            </span>
            <div>
              <span className="text-[10.5px] font-bold uppercase tracking-[.2em] text-[#958ea0]">{"// interview review"}</span>
              <h1 className="font-display text-[26px] sm:text-[30px] mt-1.5 text-[#e4e1e8]">{interview.user?.name || "Unknown user"}</h1>
              <p className="text-[12.5px] text-[#6f6f7c] mt-1">{interview.user?.email}</p>
            </div>
          </div>
          <Tag tone={interview.status === "completed" ? "good" : "purple"}>{interview.status}</Tag>
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <InfoCard label="score" value={feedback.score !== undefined ? `${feedback.score}%` : "—"} />
        <InfoCard label="role" value={interview.role || "—"} />
        <InfoCard label="difficulty" value={interview.difficulty || "—"} />
        <InfoCard label="experience" value={interview.experience || "—"} />
        <InfoCard label="company" value={interview.company || "—"} />
      </section>

      <section>
        <SectionTitle title="evaluation metrics" description="AI assessment across core interview dimensions." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {metricCards.map((m) => (
            <MetricCard key={m.label} label={m.label} score={m.data?.score} reason={m.data?.reason} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="questions & answers" description="question-level AI evaluation of the candidate." />
        <div className="space-y-4 mt-5">
          {questionFeedback.length === 0 ? (
            <Panel className="p-6 text-[#6f6f7c] text-[13px]">no question-level feedback available.</Panel>
          ) : (
            questionFeedback.map((item, index) => (
              <Panel key={item._id || index} className="overflow-hidden">
                <div className="p-5 border-b border-[#494454]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10.5px] font-bold text-[#d0bcff] mb-2 uppercase tracking-[.2em]">{`// question ${index + 1}`}</p>
                      <h3 className="text-[14px] font-semibold text-[#e4e1e8] leading-relaxed">{item.question}</h3>
                    </div>
                    <span className="shrink-0 border border-[#494454] px-3 py-1 font-display text-[13px] tracking-[.05em] text-[#d0bcff]">{item.score ?? 0}</span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <AnswerBlock title="candidate answer" text={item.candidateAnswer} />
                  <AnswerBlock title="ideal answer" text={item.idealAnswer} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <ListBlock title="strengths" items={item.strengths} good />
                    <ListBlock title="weaknesses" items={item.weaknesses} />
                  </div>
                </div>
              </Panel>
            ))
          )}
        </div>
      </section>

      <section>
        <SectionTitle title="overall AI feedback" description="final assessment generated from the complete interview." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          <Panel className="p-5">
            <div className="text-[12px] font-bold uppercase tracking-[.2em] text-[#d0bcff] mb-3">{"// summary"}</div>
            <p className="text-[12.5px] text-[#9090a0] leading-relaxed">{feedback.summary || "No summary available."}</p>
          </Panel>
          <Panel className="p-5">
            <div className="text-[12px] font-bold uppercase tracking-[.2em] text-[#34d399] mb-3">{"// recommendation"}</div>
            <p className="text-[12.5px] text-[#9090a0] leading-relaxed">{feedback.recommendation || "No recommendation available."}</p>
          </Panel>
        </div>
      </section>

      {roadmap.length > 0 && (
        <section>
          <SectionTitle title="improvement roadmap" description="AI-generated learning plan for improving future interview performance." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
            {roadmap.map((item, index) => (
              <Panel key={item._id || index} className="p-[18px]">
                <p className="text-[10.5px] font-bold uppercase tracking-[.2em] text-[#d0bcff]">{item.day}</p>
                <h3 className="font-semibold mt-2.5 text-[13.5px] text-[#e4e1e8]">{item.topic}</h3>
                <p className="text-[12px] text-[#8a8a97] mt-2 leading-relaxed">{item.goal}</p>
                {item.resource && (
                  <a href={item.resource} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[11.5px] font-bold uppercase tracking-[.2em] text-[#d0bcff]">
                    open resource →
                  </a>
                )}
              </Panel>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <Panel className="p-4">
      <p className="text-[9.5px] font-bold uppercase tracking-[.2em] text-[#6f6f7c]">{label}</p>
      <p className="text-[13px] font-semibold text-[#e4e1e8] mt-2 break-words">{value}</p>
    </Panel>
  );
}

function MetricCard({ label, score, reason }) {
  const normalizedScore = Math.max(0, Math.min(Number(score) || 0, 10));
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[13.5px] text-[#e4e1e8] capitalize">{label}</h3>
        <span className="font-display text-[#d0bcff] text-[13px] tracking-[.05em]">{normalizedScore}/10</span>
      </div>
      <div className="w-full h-[6px] bg-[#2a292e] mt-3.5">
        <div className="h-full bg-[#d0bcff] transition-all" style={{ width: `${normalizedScore * 10}%` }} />
      </div>
      <p className="text-[11.5px] text-[#8a8a97] mt-3.5 leading-relaxed">{reason || "No evaluation reason available."}</p>
    </Panel>
  );
}

function AnswerBlock({ title, text }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[.2em] text-[#6f6f7c] mb-2">{title}</p>
      <div className="bg-[#0e0e12] border border-[#2a292e] p-3.5 text-[12.5px] text-[#9090a0] leading-relaxed">{text || "No answer available."}</div>
    </div>
  );
}

function ListBlock({ title, items = [], good }) {
  return (
    <div className="bg-[#0e0e12] border border-[#2a292e] p-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        {good ? <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" /> : <AlertTriangle className="w-3.5 h-3.5 text-[#d0bcff]" />}
        <p className="text-[10.5px] font-bold uppercase tracking-[.2em] text-[#9090a0]">{title}</p>
      </div>
      {items?.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item, index) => <li key={index} className="text-[11.5px] text-[#8a8a97] leading-relaxed">• {item}</li>)}
        </ul>
      ) : (
        <p className="text-[11.5px] text-[#5c5c68]">none recorded.</p>
      )}
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="font-display text-[20px] text-[#e4e1e8]">{title}</h2>
      <p className="text-[12.5px] text-[#6f6f7c] mt-1.5">{description}</p>
    </div>
  );
}
