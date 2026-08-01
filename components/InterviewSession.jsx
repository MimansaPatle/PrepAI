"use client";
import { Clock, Bot, Mic, MicOff, Terminal, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";


export default function InterviewSession() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");

  const hasLoaded = useRef(false);

  const router = useRouter();
  const [config, setConfig] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(null);

  const loadingMessages = [
    "Analyzing your previous answer...",
    "Evaluating communication skills...",
    "Generating your next interview question...",
    "Preparing follow-up question...",
  ];

  const feedbackMessages = [
    "Analyzing all your answers...",
    "Evaluating technical knowledge...",
    "Measuring communication skills...",
    "Calculating your interview score...",
    "Generating personalized feedback...",
    "Preparing your interview report...",
  ];

  const [loadingIndex, setLoadingIndex] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);

  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const TOTAL_QUESTIONS = 2;


  useEffect(() => {

    if (!loadingStage) return;

    setLoadingTime(0);

    const messageInterval = setInterval(() => {
      setLoadingIndex(prev => prev + 1);
    }, 1500);

    const timerInterval = setInterval(() => {
      setLoadingTime(prev => +(prev + 0.1).toFixed(1));
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: interview,
            previousQuestions: [],
          }),
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

    setTimeLeft(120);

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          handleNextQuestion("");
          return 120;
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

      const finalAnswer =
        submittedAnswer ||
        currentAnswer ||
        "[Skipped or Timer Expired]";

      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId,
          question: questions[currentIndex],
          answer: finalAnswer,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const updatedAnswers = [
        ...answers,
        {
          question: questions[currentIndex],
          answer: finalAnswer,
        },
      ];

      setAnswers(updatedAnswers);
      setCurrentAnswer("");

      // Complete interview after the last question
      if (updatedAnswers.length >= TOTAL_QUESTIONS) {

        // setIsGeneratingFeedback(true);
        setLoadingIndex(0);
        setLoadingTime(0);
        setLoadingStage("feedback");
        const completeResponse = await fetch("/api/interview/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewId,
          }),
        });

        const completeData = await completeResponse.json();

        if (!completeData.success) {
          alert(completeData.message);
          return;
        }

        router.push(`/feedback?id=${interviewId}`);
        return;
      }

      // Ask Gemini for the next question
      setLoadingIndex(0);
      setLoadingTime(0);
      setLoadingStage("question");
      const nextQuestionResponse = await fetch("/api/interview/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      setLoadingStage(null);

    } catch (error) {

      // setIsLoadingQuestion(false);
      setLoadingStage(null);
      console.error(error);
      alert("Something went wrong.");

    } finally {

      setIsSubmitting(false);

    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingText("Calibrating voice signal pipeline...");
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

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-zinc-500 font-mono">
        Loading AI Simulator Configuration Node...
      </div>
    );
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loadingStage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-center space-y-8">

          {/* AI Icon */}
          <div className="relative w-fit mx-auto">
            <Bot
              className={`w-16 h-16 animate-bounce ${loadingStage === "question"
                ? "text-violet-500"
                : "text-emerald-500"
                }`}
            />

            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${loadingStage === "question"
                ? "bg-violet-400"
                : "bg-emerald-400"
                }`}
            />
          </div>

          {/* Heading */}
          <h2
            className={`text-3xl font-bold ${loadingStage === "question"
                ? "text-white"
                : "text-emerald-400"
              }`}
          >

            {loadingStage === "question"
              ? `${config.role} Interviewer is thinking...`
              : "Preparing your interview report..."}

          </h2>

          {/* Rotating Message */}
          <p className="text-zinc-400 text-lg transition-all duration-300">

            {loadingStage === "question"
              ? loadingMessages[loadingIndex % loadingMessages.length]
              : feedbackMessages[loadingIndex % feedbackMessages.length]}

          </p>

          {/* Animated Progress Bar */}
          <div className="w-80 h-3 bg-zinc-800 rounded-full overflow-hidden mx-auto">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 ${loadingStage === "question"
                ? "animate-progress-fast"
                : "animate-progress-slow"
                }`}
            />
          </div>

          {/* Elapsed Timer */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Elapsed Time
            </p>

            <p
              className={`text-2xl font-bold font-mono ${loadingStage === "question"
                ? "text-violet-400"
                : "text-emerald-400"
                }`}
            >
              {loadingTime.toFixed(1)}s
            </p>
          </div>

          {/* Footer */}
          <p className="text-sm text-zinc-500">

            {loadingStage === "question"
              ? "This usually takes 2–5 seconds"
              : "This usually takes 5–10 seconds"}

          </p>

        </div>

      </div>
    );
  }



  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 text-zinc-100 font-sans">
      <div className="w-full max-w-4xl space-y-6 animate-fadeIn">

        {/* HUD Stats panel */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 shadow-md">
          <div>
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-black">Active Workspace</span>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>{config.role || "Full Stack Developer"}</span>
              <span className="text-zinc-800">•</span>
              <span className="text-violet-400">{config.difficulty || "Medium"} Level</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">Progress</span>
              <span className="text-sm font-bold text-zinc-200 font-mono">{currentIndex + 1} / {TOTAL_QUESTIONS}</span>
            </div>
            <div className="h-10 w-[1px] bg-zinc-900"></div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">Time Budget</span>
              <span className={`text-sm font-mono font-bold flex items-center gap-1.5 ${timeLeft < 30 ? "text-red-500 animate-pulse" : "text-emerald-400"}`}>
                <Clock className="w-3.5 h-3.5" />
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Modern Gradient Progress Indicator */}
        <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`
            }}
          />
        </div>

        {/* Console split screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6">

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-zinc-500 font-bold tracking-wide block uppercase">AI Virtual Prompt:</span>
                <p className="text-base md:text-lg font-medium text-zinc-100 leading-relaxed">
                  {questions[currentIndex]}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Interactive Engineering Input
                </label>
                <button
                  onClick={toggleRecording}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${isRecording
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800"
                    }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5 animate-pulse" /> : <Mic className="w-3.5 h-3.5 text-violet-400" />}
                  {isRecording ? "Calibrating..." : "Voice Input"}
                </button>
              </div>

              {/* Simulated Voice Waveform Indicator */}
              {isRecording && (
                <div className="p-3 bg-red-950/20 text-red-400 border border-red-900/30 text-xs rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>{recordingText}</span>
                </div>
              )}

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Structure your solution sequence here... Mention architectural trade-offs, scaling limits, and technical criteria."
                rows={6}
                className="w-full bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-zinc-200 placeholder-zinc-700"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => handleNextQuestion("[Answer skipped by user]")}
                className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-all"
              >
                Skip Question
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleNextQuestion()}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-zinc-100 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-violet-950/40"
              >
                {currentIndex === questions.length - 1 ? "Submit & Evaluate" : "Save & Continue ➔"}
              </button>
            </div>
          </div>

          {/* Sidebar guidance widgets */}
          <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-zinc-200 tracking-wide uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-violet-400" />
              Live Coach Assistance
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-violet-400 font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target Keywords
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  Aim to integrate: <strong className="text-zinc-300 font-medium">{config.skills || "Core Skills"}</strong> within this explanation model.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-indigo-400 font-bold block flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  STAR Methodology
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  Configure your responses into: <strong className="text-zinc-300">Situation</strong>, <strong className="text-zinc-300">Task</strong>, <strong className="text-zinc-300">Action</strong>, and <strong className="text-zinc-300">Result</strong> loops.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-400 font-bold block flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Score Weighing Metrics
                </span>
                <ul className="list-disc pl-4 space-y-1 text-zinc-500">
                  <li>Logical Design Layout (40%)</li>
                  <li>Algorithm Optimization (30%)</li>
                  <li>Delivery Precision (30%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}