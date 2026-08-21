"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Mic, Square, Zap } from "lucide-react";

export default function InterviewSession() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");

  const hasLoaded = useRef(false);

  const router = useRouter();
  const [config, setConfig] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(null);

  const feedbackMessages = [
    "analyzing all your answers…",
    "evaluating technical knowledge…",
    "measuring communication skills…",
    "calculating your interview score…",
    "generating personalized feedback…",
    "preparing your interview report…",
  ];

  const [loadingIndex, setLoadingIndex] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);

  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const TOTAL_QUESTIONS = 4;

  useEffect(() => {
    if (!loadingStage) return;

    setLoadingTime(0);

    const messageInterval = setInterval(() => {
      setLoadingIndex((prev) => prev + 1);
    }, 1500);

    const timerInterval = setInterval(() => {
      setLoadingTime((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(timerInterval);
    };
  }, [loadingStage]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    if (!interviewId) {
      router.push("/interview");
      return;
    }

    const loadInterview = async () => {
      try {
        const response = await fetch(`/api/interview/${interviewId}`);
        const data = await response.json();

        if (!data.success) {
          alert(data.message);
          router.push("/interview");
          return;
        }

        const interview = data.interview;
        setConfig(interview);

        const aiResponse = await fetch("/api/interview/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: interview, previousQuestions: [] }),
        });

        const aiData = await aiResponse.json();

        if (aiData.quotaExceeded) {
          alert("Daily Gemini quota reached.\nPlease try again tomorrow.");
          return;
        }

        if (!aiData.success) {
          alert(aiData.message);
          return;
        }

        setQuestions([aiData.question]);
      } catch (error) {
        console.error(error);
        alert("Unable to load interview.");
        router.push("/interview");
      }
    };

    loadInterview();
  }, [interviewId]);

  useEffect(() => {
    if (loadingStage || isSubmitting) return;

    setTimeLeft(300);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion("");
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions, loadingStage, isSubmitting]);

  const handleNextQuestion = async (submittedAnswer) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalAnswer = submittedAnswer || currentAnswer || "[Skipped or Timer Expired]";

      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, question: questions[currentIndex], answer: finalAnswer }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const updatedAnswers = [...answers, { question: questions[currentIndex], answer: finalAnswer }];
      setAnswers(updatedAnswers);
      setCurrentAnswer("");

      if (updatedAnswers.length >= TOTAL_QUESTIONS) {
        setLoadingIndex(0);
        setLoadingTime(0);
        setLoadingStage("feedback");

        const completeResponse = await fetch("/api/interview/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewId }),
        });

        const completeData = await completeResponse.json();

        if (!completeData.success) {
          alert(completeData.message);
          return;
        }

        router.push(`/feedback?id=${interviewId}`);
        return;
      }

      const nextQuestionResponse = await fetch("/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          previousQuestions: updatedAnswers.map((q) => q.question),
          previousAnswers: updatedAnswers.map((q) => q.answer),
        }),
      });

      const nextQuestionData = await nextQuestionResponse.json();

      if (!nextQuestionData.success) {
        alert(nextQuestionData.message);
        return;
      }

      setQuestions((prev) => [...prev, nextQuestionData.question]);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingText("calibrating voice signal pipeline…");
      setTimeout(() => {
        const simulatedVoiceAns = `Specifically standardizing on ${config.role || "this position"}, I focus on latency reductions, test coverage benchmarks, and resilient fault isolation metrics.`;
        setCurrentAnswer((prev) => (prev ? prev + " " + simulatedVoiceAns : simulatedVoiceAns));
        setIsRecording(false);
        setRecordingText("");
      }, 3500);
    } else {
      setIsRecording(false);
      setRecordingText("");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const weights = [["logical design", "40%"], ["optimization", "30%"], ["delivery", "30%"]];

  if (questions.length === 0 && !loadingStage) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "#0e0e12" }}>
        <div className="dot-grid-terminal fixed inset-0 pointer-events-none" />
        <p className="relative font-display text-[16px] text-[#958ea0] uppercase tracking-[.2em] flex items-center gap-2">
          {"// initializing_session"} <span className="inline-block w-2.5 h-2.5 bg-[#d0bcff] animate-blockcaret" />
        </p>
      </div>
    );
  }

  if (loadingStage) {
    const message = feedbackMessages[loadingIndex % feedbackMessages.length];

    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: "#0e0e12" }}>
        <div className="dot-grid-terminal fixed inset-0 pointer-events-none" />
        <div className="relative border border-[#494454] p-10 w-full max-w-[420px]" style={{ background: "#1f1f24" }}>
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#34d399] flex-none animate-pulse" />
            <h2 className="font-display text-[20px] text-[#34d399] lowercase">preparing your report</h2>
          </div>
          <p className="text-[#958ea0] text-[13px] mb-7">{message}</p>
          <div className="h-2 bg-[#0e0e12] border border-white/[.06] overflow-hidden">
            <div className="h-full" style={{ background: "#34d399", animation: "loadfill 2.8s ease forwards" }} />
          </div>
          <div className="mt-6 text-[10px] text-[#6f6f7c] tracking-[.2em] uppercase">elapsed</div>
          <div className="font-display text-[22px] mt-1 text-[#34d399]">{loadingTime.toFixed(1)}s</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#0e0e12" }}>
      <div className="dot-grid-terminal fixed inset-0 pointer-events-none" />

      <header className="flex-none relative flex justify-between items-center px-6 py-4 border-b border-[#494454]" style={{ background: "rgba(14,14,18,.92)" }}>
        <button
          onClick={() => router.push("/interview")}
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.15em] text-[#958ea0] hover:text-[#f87171] transition-colors duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> end_interview
        </button>

        <div className="hidden md:block text-[10px] tracking-[.2em] uppercase text-[#6f6f7c]">
          {config.role || "full stack developer"} &middot; {(config.difficulty || "medium").toLowerCase()} &middot; q{currentIndex + 1}/{TOTAL_QUESTIONS}
        </div>

        <div className="text-right">
          <div className="text-[9px] uppercase tracking-[.15em] text-[#6f6f7c]">{isSubmitting ? "time (paused)" : "time_remaining"}</div>
          <div
            className={`font-display text-[16px] leading-none mt-0.5 ${
              isSubmitting ? "text-[#6f6f7c]" : timeLeft < 30 ? "text-[#f87171] animate-pulse" : "text-[#34d399]"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div className="flex-none flex gap-1 h-[3px] px-0">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
          <div key={i} className="flex-1" style={{ background: i <= currentIndex ? "#d0bcff" : "#26262c" }} />
        ))}
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="min-w-0">
            <div className="border border-[#494454] p-6 mb-5" style={{ background: "#1f1f24" }}>
              <div className="flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="PrepAI" className="w-9 h-9 object-contain flex-none" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#d0bcff] mb-2.5">{"// ai_prompt"}</div>
                  <div className="text-[14.5px] sm:text-[15.5px] leading-[1.6] text-[#e4e1e8]">{questions[currentIndex]}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[.15em] text-[#6f6f7c]">your_answer</span>
              <button
                onClick={toggleRecording}
                className={`flex items-center gap-2 border px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[.1em] transition-all duration-200 cursor-pointer hover:scale-[1.03] ${
                  isRecording ? "border-[#f87171]/40 text-[#f87171]" : "border-[#494454] text-[#cbc3d7] hover:border-[#6f6f7c]"
                }`}
                style={isRecording ? { background: "rgba(248,113,113,.08)" } : undefined}
              >
                {isRecording ? <Square className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                {isRecording ? "calibrating…" : "voice_input"}
              </button>
            </div>

            {isRecording && (
              <div className="p-3 border border-[#f87171]/25 text-[#f87171] text-[11.5px] flex items-center gap-2.5 mb-2.5" style={{ background: "rgba(248,113,113,.06)" }}>
                <span className="w-1.5 h-1.5 bg-[#f87171] flex-none animate-ping" />
                {recordingText}
              </div>
            )}

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="structure your answer here… mention approach, trade-offs, and outcome."
              className="w-full h-[180px] border border-[#494454] focus:border-[#d0bcff] p-4 text-[13.5px] leading-[1.65] resize-none outline-none text-[#e4e1e8] placeholder:text-[#6f6f7c] transition-colors duration-200"
              style={{ background: "#1f1f24" }}
            />

            <div className="flex justify-between items-center mt-3.5">
              <button
                disabled={isSubmitting}
                onClick={() => handleNextQuestion("[Answer skipped by user]")}
                className="text-[11px] font-bold uppercase tracking-[.1em] text-[#6f6f7c] hover:text-[#e4e1e8] transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                skip_question
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleNextQuestion()}
                className="inline-flex items-center gap-2 bg-[#d0bcff] text-[#3c0091] text-[11.5px] font-bold uppercase tracking-[.15em] px-7 py-3.5 hover:bg-[#e9ddff] hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                style={{ boxShadow: "0 0 20px 0 rgba(208,188,255,.2)" }}
              >
                {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-[#3c0091]/30 border-t-[#3c0091] rounded-full animate-spin" />}
                {isSubmitting
                  ? "evaluating…"
                  : currentIndex === TOTAL_QUESTIONS - 1
                  ? "submit_&_evaluate »"
                  : "save_&_continue »"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="border border-[#494454] p-5" style={{ background: "#1f1f24" }}>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#d0bcff] mb-4">
                <Zap className="w-3.5 h-3.5" /> {"// live_coach_tips"}
              </div>
              <div className="border border-white/[.06] p-3.5 mb-2.5" style={{ background: "#0e0e12" }}>
                <div className="text-[11px] font-bold text-[#e4e1e8] mb-1.5">target keywords</div>
                <div className="text-[11px] text-[#958ea0] leading-[1.6]">weave your <span className="text-[#cbc3d7]">{config.skills || "core skills"}</span> into the model.</div>
              </div>
              <div className="border border-white/[.06] p-3.5 mb-2.5" style={{ background: "#0e0e12" }}>
                <div className="text-[11px] font-bold text-[#e4e1e8] mb-1.5">star method</div>
                <div className="text-[11px] text-[#958ea0] leading-[1.6]">situation, task, action, result.</div>
              </div>
              <div className="border border-white/[.06] p-3.5" style={{ background: "#0e0e12" }}>
                <div className="text-[11px] font-bold text-[#e4e1e8] mb-2">score weighting</div>
                {weights.map(([l, p]) => (
                  <div key={l} className="flex justify-between text-[11px] text-[#958ea0] py-[3px]">
                    <span>{l}</span>
                    <span className="text-[#cbc3d7]">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#494454] p-5" style={{ background: "#1f1f24" }}>
              <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#6f6f7c] mb-4">{"// question_navigator"}</div>
              <div className="flex gap-2">
                {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => {
                  const done = i < currentIndex;
                  const active = i === currentIndex;
                  return (
                    <div
                      key={i}
                      className="w-9 h-9 flex items-center justify-center text-[12px] font-bold border flex-none"
                      style={
                        active
                          ? { borderColor: "#d0bcff", color: "#d0bcff", background: "rgba(208,188,255,.1)" }
                          : done
                          ? { borderColor: "rgba(52,211,153,.35)", color: "#34d399", background: "rgba(52,211,153,.08)" }
                          : { borderColor: "#494454", color: "#6f6f7c", background: "#0e0e12" }
                      }
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
