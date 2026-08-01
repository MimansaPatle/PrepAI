"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IoArrowBackOutline,
  IoPersonCircleOutline,
  IoCheckmarkCircleOutline,
  IoBulbOutline,
  IoWarningOutline,
  IoSchoolOutline,
} from "react-icons/io5";

export default function AdminInterviewDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const res = await fetch(
          `/api/admin/interviews/${params.id}`
        );

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

    if (params.id) {
      loadInterview();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center">
        Loading interview...
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">
          {error || "Interview not found."}
        </p>

        <button
          onClick={() => router.push("/admin/interviews")}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to Interviews
        </button>
      </div>
    );
  }

  const feedback = interview.feedback || {};
  const metrics = feedback.metrics || {};
const questionFeedback = feedback.questionFeedback || [];
  const roadmap = feedback.roadmap || [];

  const metricCards = [
    {
      label: "Communication",
      data: metrics.communication,
    },
    {
      label: "Technical Knowledge",
      data: metrics.technicalKnowledge,
    },
    {
      label: "Confidence",
      data: metrics.confidence,
    },
    {
      label: "Problem Solving",
      data: metrics.problemSolving,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Back Button */}
        <button
          onClick={() => router.push("/admin/interviews")}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition"
        >
          <IoArrowBackOutline />
          Back to Interviews
        </button>

        {/* Header */}
        <header className="border-b border-zinc-900 pb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <IoPersonCircleOutline className="text-5xl text-violet-400" />

              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-violet-400">
                  Interview Review
                </p>

                <h1 className="text-3xl font-bold mt-1">
                  {interview.user?.name || "Unknown User"}
                </h1>

                <p className="text-sm text-zinc-500 mt-1">
                  {interview.user?.email}
                </p>
              </div>

            </div>

            <div
              className={`text-xs px-3 py-1.5 rounded-full border self-start ${
                interview.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {interview.status}
            </div>

          </div>

        </header>

        {/* Interview Information */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <InfoCard
            label="Score"
            value={
              feedback.score !== undefined
                ? `${feedback.score}%`
                : "—"
            }
          />

          <InfoCard
            label="Role"
            value={interview.role || "—"}
          />

          <InfoCard
            label="Difficulty"
            value={interview.difficulty || "—"}
          />

          <InfoCard
            label="Experience"
            value={interview.experience || "—"}
          />

          <InfoCard
            label="Company"
            value={interview.company || "—"}
          />

        </section>

        {/* Evaluation Metrics */}
        <section>

          <SectionTitle
            title="Evaluation Metrics"
            description="AI assessment across core interview dimensions."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

            {metricCards.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                score={metric.data?.score}
                reason={metric.data?.reason}
              />
            ))}

          </div>

        </section>

        {/* Questions */}
        <section>

          <SectionTitle
            title="Questions & Answers"
            description="Question-level AI evaluation of the candidate."
          />

          <div className="space-y-5 mt-5">

            {questionFeedback.length === 0 ? (
              <div className="border border-zinc-800 rounded-2xl p-6 text-zinc-500">
                No question-level feedback available.
              </div>
            ) : (
              questionFeedback.map((item, index) => (

                <div
                  key={item._id || index}
                  className="bg-zinc-900/20 border border-zinc-800/70 rounded-2xl overflow-hidden"
                >

                  {/* Question */}
                  <div className="p-5 border-b border-zinc-900">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-xs text-violet-400 font-mono mb-2">
                          QUESTION {index + 1}
                        </p>

                        <h3 className="text-base font-semibold text-zinc-100 leading-relaxed">
                          {item.question}
                        </h3>
                      </div>

                      <span className="shrink-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-sm font-mono">
                        {item.score ?? 0}
                      </span>

                    </div>

                  </div>

                  <div className="p-5 space-y-5">

                    {/* Candidate Answer */}
                    <AnswerBlock
                      title="Candidate Answer"
                      text={item.candidateAnswer}
                    />

                    {/* Ideal Answer */}
                    <AnswerBlock
                      title="Ideal Answer"
                      text={item.idealAnswer}
                    />

                    {/* Strengths / Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <ListBlock
                        title="Strengths"
                        items={item.strengths}
                        type="success"
                      />

                      <ListBlock
                        title="Weaknesses"
                        items={item.weaknesses}
                        type="warning"
                      />

                    </div>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

        {/* Overall Feedback */}
        <section>

          <SectionTitle
            title="Overall AI Feedback"
            description="Final assessment generated from the complete interview."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

            <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">

              <div className="flex items-center gap-2 mb-3">
                <IoBulbOutline className="text-violet-400" />

                <h3 className="font-semibold">
                  Summary
                </h3>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed">
                {feedback.summary || "No summary available."}
              </p>

            </div>

            <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">

              <div className="flex items-center gap-2 mb-3">
                <IoSchoolOutline className="text-emerald-400" />

                <h3 className="font-semibold">
                  Recommendation
                </h3>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed">
                {feedback.recommendation ||
                  "No recommendation available."}
              </p>

            </div>

          </div>

        </section>

        {/* Improvement Roadmap */}
        {roadmap.length > 0 && (
          <section>

            <SectionTitle
              title="Improvement Roadmap"
              description="AI-generated learning plan for improving future interview performance."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

              {roadmap.map((item, index) => (

                <div
                  key={item._id || index}
                  className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-5"
                >

                  <p className="text-xs font-mono uppercase tracking-wider text-violet-400">
                    {item.day}
                  </p>

                  <h3 className="font-semibold mt-2 text-zinc-100">
                    {item.topic}
                  </h3>

                  <p className="text-sm text-zinc-400 mt-2">
                    {item.goal}
                  </p>

                  {item.resource && (
                    <a
                      href={item.resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-xs text-violet-400 hover:text-violet-300"
                    >
                      Open Resource →
                    </a>
                  )}

                </div>

              ))}

            </div>

          </section>
        )}

      </div>

    </div>
  );
}

/* ---------------- Small Components ---------------- */

function InfoCard({ label, value }) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-4">

      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-zinc-200 mt-2 break-words">
        {value}
      </p>

    </div>
  );
}

function MetricCard({ label, score, reason }) {
  const normalizedScore = Math.max(
    0,
    Math.min(Number(score) || 0, 10)
  );

  return (
    <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <h3 className="font-semibold text-zinc-200">
          {label}
        </h3>

        <span className="font-mono text-violet-400">
          {normalizedScore}/10
        </span>

      </div>

      <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">

        <div
          className="h-full bg-violet-500 rounded-full transition-all"
          style={{
            width: `${normalizedScore * 10}%`,
          }}
        />

      </div>

      <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
        {reason || "No evaluation reason available."}
      </p>

    </div>
  );
}

function AnswerBlock({ title, text }) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
        {title}
      </p>

      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm text-zinc-400 leading-relaxed">
        {text || "No answer available."}
      </div>

    </div>
  );
}

function ListBlock({ title, items = [], type }) {
  const success = type === "success";

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">

      <div className="flex items-center gap-2 mb-3">

        {success ? (
          <IoCheckmarkCircleOutline className="text-emerald-400" />
        ) : (
          <IoWarningOutline className="text-amber-400" />
        )}

        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </p>

      </div>

      {items?.length > 0 ? (
        <ul className="space-y-2">

          {items.map((item, index) => (
            <li
              key={index}
              className="text-xs text-zinc-500 leading-relaxed"
            >
              • {item}
            </li>
          ))}

        </ul>
      ) : (
        <p className="text-xs text-zinc-600">
          None recorded.
        </p>
      )}

    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>

      <h2 className="text-xl font-bold text-zinc-100">
        {title}
      </h2>

      <p className="text-sm text-zinc-500 mt-1">
        {description}
      </p>

    </div>
  );
}