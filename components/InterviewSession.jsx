"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Zap } from "lucide-react";
import { Robot, Card } from "@/components/ui/Brand";

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
    "Analyzing all your answers…",
    "Evaluating technical knowledge…",
    "Measuring communication skills…",
    "Calculating your interview score…",
    "Generating personalized feedback…",
    "Preparing your interview report…",
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
    if (loadingStage) return;

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
  }, [currentIndex, questions, loadingStage]);

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
      setRecordingText("Calibrating voice signal pipeline…");
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

  if (questions.length === 0 && !loadingStage) {
    return (
      <div className="min-h-[58vh] flex flex-col items-center justify-center text-center animate-rise">
        <Robot v="a" className="w-[110px] h-auto animate-bob mb-6" />
        <p className="text-[#8a8a97] text-[13px] tracking-[.3px]">Loading AI simulator configuration node…</p>
      </div>
    );
  }

  if (loadingStage) {
    const message = feedbackMessages[loadingIndex % feedbackMessages.length];

    return (
      <div className="min-h-[58vh] flex flex-col items-center justify-center text-center">
        <div className="relative mb-2">
          <div className="absolute w-[190px] h-[190px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-glowpulse" style={{ background: "radial-gradient(circle,rgba(52,211,153,.42),transparent 66%)", filter: "blur(14px)" }} />
          <Robot v="a" className="w-[170px] h-auto relative z-[2]" style={{ animation: "bob 1.6s ease-in-out infinite" }} />
        </div>
        <div className="flex items-center gap-2.5 mb-2.5 mt-6">
          <h2 className="font-extrabold text-[20px] sm:text-[22px] tracking-[-.5px] text-good">preparing your report</h2>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full animate-dotp bg-good" style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        </div>
        <p className="text-[#8a8a97] text-[13.5px] mb-6">{message}</p>
        <div className="w-[280px] sm:w-[320px] h-2 bg-field rounded-full overflow-hidden border border-white/[.05]">
          <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#34d399,#5b9be8)", animation: "loadfill 2.8s ease forwards" }} />
        </div>
        <div className="mt-[22px] text-[10px] text-[#5c5c68] tracking-[.6px]">ELAPSED</div>
        <div className="font-extrabold text-[20px] mt-1 text-good">{loadingTime.toFixed(1)}s</div>
      </div>
    );
  }

  const weights = [["logical design", "40%"], ["optimization", "30%"], ["delivery", "30%"]];

  return (
    <div className="animate-rise">
      <Card className="px-[18px] sm:px-[22px] py-[16px] sm:py-[18px] flex flex-wrap items-center justify-between gap-4 mb-2 rounded-2xl">
        <div>
          <div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-1">ACTIVE WORKSPACE</div>
          <div className="font-semibold text-[14px] sm:text-[15px]">{config.role || "Full Stack Developer"} <span className="text-[#5c5c68]">/</span> <span className="text-purple-light">{(config.difficulty || "medium").toLowerCase()}</span></div>
        </div>
        <div className="flex gap-[30px]">
          <div>
            <div className="text-[10px] text-[#7a7a87] tracking-[.6px]">PROGRESS</div>
            <div className="font-extrabold text-[17px]">{currentIndex + 1}/{TOTAL_QUESTIONS}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#7a7a87] tracking-[.6px]">TIME</div>
            <div className={`font-extrabold text-[17px] ${timeLeft < 30 ? "text-bad animate-pulse" : "text-good"}`}>{formatTime(timeLeft)}</div>
          </div>
        </div>
      </Card>

      <div className="h-1.5 bg-field rounded-full overflow-hidden mb-[22px]">
        <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${Math.round(((currentIndex + 1) / TOTAL_QUESTIONS) * 100)}%`, background: "linear-gradient(90deg,#8b5cf6,#5b9be8)" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div>
          <Card className="p-5 sm:p-6 mb-4">
            <div className="flex gap-4">
              <Robot v="b" className="w-14 h-auto flex-none animate-bob self-start" />
              <div>
                <div className="text-[10px] text-purple tracking-[.6px] mb-2.5">// ai virtual prompt</div>
                <div className="text-[14.5px] sm:text-[15.5px] leading-[1.6] text-[#e6e6ec] tracking-[-.2px]">{questions[currentIndex]}</div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] text-[#7a7a87] tracking-[.6px]">YOUR ANSWER</span>
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-[7px] border px-3 py-1.5 rounded-[9px] text-[11.5px] ${isRecording ? "bg-bad/15 border-bad/30 text-bad" : "bg-field border-white/[.1] text-[#c4c4cf]"}`}
            >
              <span className={`w-[7px] h-[7px] rounded-full ${isRecording ? "bg-bad animate-pulse" : "bg-purple-light"}`} />
              {isRecording ? "calibrating…" : "voice input"}
            </button>
          </div>

          {isRecording && (
            <div className="p-3 bg-bad/10 text-bad border border-bad/20 text-xs rounded-xl flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-bad animate-ping" />
              <span>{recordingText}</span>
            </div>
          )}

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="structure your solution here… mention architecture, trade-offs, scaling limits."
            className="w-full h-[180px] bg-panel border border-white/[.1] rounded-[14px] p-4 text-[13.5px] leading-[1.65] resize-none outline-none text-[#f2f2f5]"
          />

          <div className="flex justify-between items-center mt-3.5">
            <button disabled={isSubmitting} onClick={() => handleNextQuestion("[Answer skipped by user]")} className="bg-transparent border-0 text-[#7a7a87] text-[13px] cursor-pointer px-1 py-2 disabled:opacity-50">
              skip question
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => handleNextQuestion()}
              className="inline-flex items-center gap-2 border-0 text-white px-6 py-3 rounded-xl text-[13.5px] font-semibold disabled:opacity-70"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 10px 26px rgba(124,58,237,.32)" }}
            >
              {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isSubmitting
                ? "Evaluating…"
                : currentIndex === TOTAL_QUESTIONS - 1
                ? "Submit & evaluate"
                : "Save & continue →"}
            </button>
          </div>
        </div>

        <div>
          <Card className="p-[18px]">
            <div className="flex items-center gap-1.5 text-[10px] text-purple-light tracking-[.6px] mb-3.5"><Zap className="w-3.5 h-3.5" /> LIVE COACH TIPS</div>
            <div className="p-[13px] bg-field rounded-xl mb-[11px]">
              <div className="text-[12px] font-semibold text-purple-lilac mb-1.5">Target keywords</div>
              <div className="text-[11.5px] text-[#8a8a97] leading-[1.5]">Weave your <span className="text-[#e6e6ec]">{config.skills || "core skills"}</span> into the model.</div>
            </div>
            <div className="p-[13px] bg-field rounded-xl mb-[11px]">
              <div className="text-[12px] font-semibold text-purple-lilac mb-1.5">STAR method</div>
              <div className="text-[11.5px] text-[#8a8a97] leading-[1.5]">Situation, Task, Action, Result.</div>
            </div>
            <div className="p-[13px] bg-field rounded-xl">
              <div className="text-[12px] font-semibold text-purple-lilac mb-2">Score weighting</div>
              {weights.map(([l, p]) => (
                <div key={l} className="flex justify-between text-[11.5px] text-[#8a8a97] py-[3px]">
                  <span>{l}</span>
                  <span className="text-[#e6e6ec]">{p}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-[18px] mt-3.5">
            <div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-3.5">QUESTION NAVIGATOR</div>
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                <div
                  key={i}
                  className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[12.5px] font-bold border"
                  style={
                    i === currentIndex
                      ? { background: "rgba(139,92,246,.2)", color: "#c4b5fd", borderColor: "rgba(139,92,246,.4)" }
                      : i < currentIndex
                      ? { background: "rgba(52,211,153,.14)", color: "#34d399", borderColor: "rgba(255,255,255,.07)" }
                      : { background: "#16161e", color: "#7a7a87", borderColor: "rgba(255,255,255,.07)" }
                  }
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
