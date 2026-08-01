"use client";

import React, { useEffect, useState } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCalendarOutline,
  IoChatbubbleEllipsesOutline,
  IoCodeSlashOutline,
  IoPersonOutline,
  IoBulbOutline,
} from "react-icons/io5";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
// import { generateInterviewPDF } from "@/lib/generatePDF";
import { generateInterviewPDF } from "@/lib/generateInterviewPDF";

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


  const metrics = [
    {
      metric: "Communication",
      score: feedback?.metrics?.communication?.score ?? 0,
      reason: feedback?.metrics?.communication?.reason ?? "",
      icon: <IoChatbubbleEllipsesOutline size={22} />,
    },
    {
      metric: "Technical Knowledge",
      score: feedback?.metrics?.technicalKnowledge?.score ?? 0,
      reason: feedback?.metrics?.technicalKnowledge?.reason ?? "",
      icon: <IoCodeSlashOutline size={22} />,
    },
    {
      metric: "Confidence",
      score: feedback?.metrics?.confidence?.score ?? 0,
      reason: feedback?.metrics?.confidence?.reason ?? "",
      icon: <IoPersonOutline size={22} />,
    },
    {
      metric: "Problem Solving",
      score: feedback?.metrics?.problemSolving?.score ?? 0,
      reason: feedback?.metrics?.problemSolving?.reason ?? "",
      icon: <IoBulbOutline size={22} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Generating AI Feedback...
      </div>
    );
  }
  if (!feedback || feedback.score == null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Feedback not available.
      </div>
    );
  }
  return (

    <div className="bg-zinc-950 text-zinc-50 min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="flex flex-col lg:flex-row justify-between gap-10">

            {/* Left */}

            <div className="space-y-4">

              <span className="text-xs uppercase tracking-[0.3em] text-violet-400 font-semibold">
                AI Interview Report
              </span>

              <h1 className="text-4xl font-bold">
                {interview?.role}
              </h1>

              <p className="text-zinc-400">
                Personalized feedback generated after evaluating your interview responses.
              </p>

              <div className="grid grid-cols-2 gap-5 pt-6">

                <div>
                  <p className="text-xs text-zinc-500 uppercase">
                    Difficulty
                  </p>

                  <p className="font-semibold">
                    {interview?.difficulty}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 uppercase">
                    Experience
                  </p>

                  <p className="font-semibold">
                    {interview?.experience}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 uppercase">
                    Questions
                  </p>

                  <p className="font-semibold">
                    {answers.length}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 uppercase">
                    Company
                  </p>

                  <p className="font-semibold">
                    {interview?.company || "General"}
                  </p>
                </div>

              </div>

            </div>

            {/* Right */}

            <div className="flex flex-col items-center justify-center">

              <div className="w-44 h-44 rounded-full border-[10px] border-emerald-500 flex items-center justify-center">

                <div className="text-center">

                  <h2 className="text-5xl font-black text-emerald-400">
                    <CountUp
                      end={feedback.score}
                      duration={2}
                      suffix="%"
                    />
                  </h2>

                  <p className="text-sm text-zinc-400 mt-2">
                    Overall Score
                  </p>

                </div>

              </div>

              <div className="mt-6">

                {feedback.score >= 80 && (
                  <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm">
                    Excellent Performance
                  </span>
                )}

                {feedback.score >= 60 && feedback.score < 80 && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
                    Good Performance
                  </span>
                )}

                {feedback.score < 60 && (
                  <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm">
                    Needs Improvement
                  </span>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ================= PERFORMANCE METRICS ================= */}

        <div>

          <h2 className="text-2xl font-bold mb-6">
            Performance Metrics
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {metrics.map((item, index) => {

              const percentage = (item.score / 5) * 100;

              let color = "bg-red-500";

              let label = "Needs Improvement";

              if (item.score >= 4) {
                color = "bg-emerald-500";
                label = "Excellent";
              }
              else if (item.score >= 3) {
                color = "bg-yellow-500";
                label = "Good";
              }

              return (

                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

                  <div className="flex justify-between items-center mb-5">

                    <div className="p-3 rounded-xl bg-zinc-800">
                      {item.icon}
                    </div>

                    <span className="text-3xl font-bold">
                      {item.score}
                      <span className="text-lg text-zinc-500">/5</span>
                    </span>

                  </div>

                  <h3 className="font-semibold mb-3">
                    {item.metric}
                  </h3>

                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">

                    <div
                      className={`h-full ${color} transition-all duration-1000`}
                      style={{
                        width: `${percentage}%`
                      }}
                    />

                  </div>

                  <p className="text-sm text-zinc-400 mt-3">
                    {label}
                  </p>

                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {item.reason}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

        {/* ================= STRENGTHS & WEAKNESSES ================= */}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Strengths */}

          <div className="bg-zinc-900 border border-emerald-900/40 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">

                <IoCheckmarkCircle className="text-emerald-400 text-2xl" />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Strengths
                </h2>

                <p className="text-sm text-zinc-500">
                  Things you performed well.
                </p>

              </div>

            </div>

            {
              feedback?.strengths?.length ?

                <div className="space-y-4">

                  {feedback.strengths.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-4 bg-zinc-950 rounded-xl p-4 border border-zinc-800">

                      <div className="mt-1">

                        <IoCheckmarkCircle
                          className="text-emerald-400 text-lg" />

                      </div>

                      <p className="text-zinc-300 leading-relaxed">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

                :

                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 text-center text-zinc-500">

                  AI did not identify any strengths.

                </div>

            }

          </div>

          {/* Weaknesses */}

          <div className="bg-zinc-900 border border-red-900/40 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">

                <IoCloseCircle className="text-red-400 text-2xl" />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Areas to Improve
                </h2>

                <p className="text-sm text-zinc-500">
                  Focus on these topics.
                </p>

              </div>

            </div>

            {
              feedback?.weaknesses?.length ?

                <div className="space-y-4">

                  {feedback.weaknesses.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-4 bg-zinc-950 rounded-xl p-4 border border-zinc-800">

                      <div className="mt-1">

                        <IoCloseCircle
                          className="text-red-400 text-lg" />

                      </div>

                      <p className="text-zinc-300 leading-relaxed">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

                :

                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 text-center text-zinc-500">

                  AI did not identify any weaknesses.

                </div>

            }

          </div>

        </div>

        {/* ================= LEARNING ROADMAP ================= */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="mb-8">

            <h2 className="text-2xl font-bold">
              Personalized Learning Roadmap
            </h2>

            <p className="text-zinc-500 mt-2">
              Based on your interview performance, these are the topics you should focus on next.
            </p>

          </div>

          {
            feedback?.roadmap?.length ?

              <div className="relative">

                {/* Vertical Line */}

                <div className="absolute left-5 top-2 bottom-2 w-[2px] bg-zinc-700"></div>

                <div className="space-y-8">

                  {
                    feedback.roadmap.map((plan, index) => (

                      <div
                        key={index}
                        className="relative flex gap-6">

                        {/* Timeline Dot */}

                        <div className="z-10">

                          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-sm">

                            {index + 1}

                          </div>

                        </div>

                        {/* Card */}

                        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-5">

                          <div className="flex justify-between items-center">

                            <span className="text-xs uppercase tracking-widest text-violet-400">

                              {plan.day}

                            </span>

                          </div>

                          <h3 className="mt-3 text-lg font-semibold">

                            {plan.topic}

                          </h3>

                        </div>

                      </div>

                    ))
                  }

                </div>

              </div>

              :

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">

                AI did not generate a learning roadmap.

              </div>

          }

        </div>
        {/* ================= INTERVIEW ANALYSIS ================= */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="mb-8">

            <h2 className="text-2xl font-bold">
              Interview Analysis
            </h2>

            <p className="text-zinc-500 mt-2">
              Review each interview question along with your submitted response.
            </p>

          </div>

          {
            answers.length === 0 ?

              <div className="text-center py-10 text-zinc-500">

                No interview questions found.

              </div>

              :

              <div className="space-y-6">

                {
                  answers.map((item, index) => {

                    const questionFeedback = feedback?.questionFeedback?.[index];

                    return (

                      <div
                        key={index}
                        className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">

                        {/* Header */}

                        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900">

                          <div>

                            <span className="text-xs uppercase tracking-widest text-violet-400">

                              Question {index + 1}

                            </span>

                          </div>

                          {/* Future Score */}

                          <div>

                            <span
                              className={`text-sm px-3 py-1 rounded-full font-medium ${questionFeedback?.score >= 8
                                ? "bg-emerald-500/20 text-emerald-400"
                                : questionFeedback?.score >= 5
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                                }`}
                            >
                              {questionFeedback
                                ? `${questionFeedback.score}/10`
                                : "Not Evaluated"}
                            </span>

                          </div>

                        </div>

                        {/* Question */}

                        <div className="p-6">

                          <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-2">

                            Interview Question

                          </h3>

                          <p className="text-lg font-medium leading-relaxed">

                            {item.question}

                          </p>

                        </div>

                        {/* Answer */}

                        <div className="px-6 pb-6">

                          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">

                            <h4 className="text-sm uppercase tracking-wider text-emerald-400 mb-3">

                              Your Answer

                            </h4>

                            <p className="text-zinc-300 whitespace-pre-wrap leading-7">

                              {item.answer || "No answer submitted."}

                            </p>

                            {questionFeedback && (
                              <div className="mt-6 space-y-5">

                                {/* Strengths */}

                                <div>
                                  <h4 className="text-emerald-400 font-semibold mb-2">
                                    AI Strengths
                                  </h4>

                                  <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                    {questionFeedback.strengths.map((point, i) => (
                                      <li key={i}>{point}</li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Weaknesses */}

                                <div>
                                  <h4 className="text-red-400 font-semibold mb-2">
                                    AI Weaknesses
                                  </h4>

                                  <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                    {questionFeedback.weaknesses.map((point, i) => (
                                      <li key={i}>{point}</li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Ideal Answer */}

                                <div>
                                  <h4 className="text-violet-400 font-semibold mb-2">
                                    Ideal Answer
                                  </h4>

                                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 leading-7">
                                    {questionFeedback.idealAnswer}
                                  </div>
                                </div>

                              </div>
                            )}

                          </div>

                        </div>

                      </div>

                    );
                  })
                }

              </div>

          }

        </div>

        {/* ================= REPORT FOOTER ================= */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

            <div>

              <h2 className="text-2xl font-bold">
                Interview Completed
              </h2>

              <p className="text-zinc-500 mt-2">
                Great job completing your mock interview.
                Review your feedback and keep practicing to improve.
              </p>

            </div>

            <div className="text-center">

              <p className="text-sm text-zinc-500">
                Overall Score
              </p>

              <h1 className="text-5xl font-black text-emerald-400">
                {feedback.score}%
              </h1>

            </div>

          </div>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">

            <button
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700  font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/interview")} >
              Retake Interview
            </button>

            <button
              className="px-6 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800  hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/dashboard")}>
              Dashboard
            </button>

            <button
              className=" hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition"
               onClick={() => generateInterviewPDF(interview)} >
              Download PDF
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}