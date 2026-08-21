"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowRight, Zap, BarChart3 } from "lucide-react";
import DashboardSkeleton from "./DashboardSkeleton";
import { useToast } from "@/components/ui/ToastProvider";

const METRIC_META = {
  communication: { label: "communication" },
  technicalKnowledge: { label: "technical knowledge" },
  confidence: { label: "confidence" },
  problemSolving: { label: "problem solving" },
};

const QUICK_DRILLS = [
  { tag: "star", tagColor: "#d0bcff", title: "behavioral: conflict & failure", meta: "6q · 5m", difficulty: "Easy", skills: "" },
  { tag: "tech", tagColor: "#a3c9ff", title: "system design: rate limiter", meta: "4q · 12m", role: "Backend Developer", difficulty: "Hard", skills: "System Design" },
  { tag: "write", tagColor: "#c6c6c7", title: "concise answers under 150 words", meta: "8q · 10m", difficulty: "Medium", skills: "" },
];

const glassPanel = { background: "#1f1f24" };
const ctaStyle = { boxShadow: "0 0 20px 0 rgba(208,188,255,.2)" };

function SegmentedBar({ value, color }) {
  const total = 10;
  const active = Math.round((value / 100) * total);
  return (
    <div className="flex gap-[2px] h-2 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="flex-1" style={{ background: i < active ? color : "#494454" }} />
      ))}
    </div>
  );
}

function StatCard({ label, glowColor, children }) {
  return (
    <div className="relative overflow-hidden p-6 rounded-[4px] border border-[#494454] group" style={glassPanel}>
      <div
        className="absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `${glowColor}0d` }}
      />
      <div className="relative z-10">
        <span className="text-[12px] font-bold tracking-[.2em] text-[#cbc3d7] uppercase mb-4 block">{label}</span>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(true);
  const [allInterviews, setAllInterviews] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [startingRecommended, setStartingRecommended] = useState(false);
  const [launchingDrill, setLaunchingDrill] = useState(null);
  const isPageLoading = loadingDashboard || loadingInterview || loadingHistory;

  const fullName = dashboardData?.user?.name || "user";
  const firstNameLower = fullName.split(" ")[0].toLowerCase();
  const firstName = firstNameLower.charAt(0).toUpperCase() + firstNameLower.slice(1);

  useEffect(() => {
    async function loadCurrentInterview() {
      try {
        const res = await fetch("/api/interview/current");
        const data = await res.json();
        if (data.success) setCurrentInterview(data.interview);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInterview(false);
      }
    }
    loadCurrentInterview();
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.success) setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDashboard(false);
      }
    }
    loadDashboard();
  }, []);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/interview/history");
        const data = await res.json();
        if (data.success) setAllInterviews(data.interviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 18) return "Afternoon";
    return "Evening";
  }, []);

  const weekChart = useMemo(() => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - dayOfWeek);

    const total = allInterviews.filter((iv) => iv.completedAt && new Date(iv.completedAt) >= monday).length;
    return { total };
  }, [allInterviews]);

  const streak = useMemo(() => {
    const daySet = new Set(
      allInterviews.filter((iv) => iv.completedAt).map((iv) => new Date(iv.completedAt).toDateString())
    );

    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    if (!daySet.has(cursor.toDateString())) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (daySet.has(cursor.toDateString())) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return count;
  }, [allInterviews]);

  const scoreTrend = useMemo(() => {
    const scored = allInterviews.filter((iv) => typeof iv.feedback?.score === "number");
    if (scored.length < 2) return null;
    const latest = scored[0].feedback.score;
    const restAvg = scored.slice(1).reduce((a, b) => a + b.feedback.score, 0) / (scored.length - 1);
    return Math.round(latest - restAvg);
  }, [allInterviews]);

  const metricsAgg = useMemo(() => {
    const sums = { communication: 0, technicalKnowledge: 0, confidence: 0, problemSolving: 0 };
    let n = 0;

    allInterviews.forEach((iv) => {
      const m = iv.feedback?.metrics;
      if (!m) return;
      n++;
      Object.keys(sums).forEach((k) => {
        sums[k] += m[k]?.score ?? 0;
      });
    });

    if (n === 0) return [];

    return Object.keys(sums).map((key) => ({
      key,
      label: METRIC_META[key].label,
      pct: Math.round((sums[key] / n / 5) * 100),
    }));
  }, [allInterviews]);

  const weakest = useMemo(() => {
    if (metricsAgg.length === 0) return null;
    return [...metricsAgg].sort((a, b) => a.pct - b.pct)[0];
  }, [metricsAgg]);

  if (isPageLoading) return <DashboardSkeleton />;

  const goToInterview = () => router.push(currentInterview ? `/interviewsession?id=${currentInterview._id}` : "/interview");

  const startRecommended = async () => {
    if (currentInterview) {
      router.push(`/interviewsession?id=${currentInterview._id}`);
      return;
    }

    setStartingRecommended(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: dashboardData?.user?.favoriteRole || "Full Stack Developer",
          experience: dashboardData?.user?.experience || "1–2 Years",
          difficulty: "Medium",
          skills: "",
          company: "",
        }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast?.({ title: "couldn't start interview", description: data.message || "please try again." });
        setStartingRecommended(false);
        return;
      }

      router.push(`/interviewsession?id=${data.interviewId}`);
    } catch (err) {
      console.error(err);
      showToast?.({ title: "something went wrong", description: "please try again." });
      setStartingRecommended(false);
    }
  };

  const startDrill = async (drill) => {
    if (startingRecommended || launchingDrill) return;

    setLaunchingDrill(drill.tag);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: drill.role || dashboardData?.user?.favoriteRole || "Full Stack Developer",
          experience: dashboardData?.user?.experience || "1–2 Years",
          difficulty: drill.difficulty,
          skills: drill.skills || "",
          company: "",
        }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast?.({ title: "couldn't start drill", description: data.message || "please try again." });
        setLaunchingDrill(null);
        return;
      }

      router.push(`/interviewsession?id=${data.interviewId}`);
    } catch (err) {
      console.error(err);
      showToast?.({ title: "something went wrong", description: "please try again." });
      setLaunchingDrill(null);
    }
  };

  return (
    <div className="animate-rise flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[12px] font-bold tracking-[.2em] text-[#cbc3d7] uppercase mb-2 block">{"// welcome back"}</span>
          <h2 className="font-display text-[42px] sm:text-[56px] lg:text-[64px] leading-[1.1] tracking-[-0.02em] text-[#e4e1e8] m-0">
            {greeting}, {firstName}.
          </h2>
          <p className="text-[15px] sm:text-[18px] leading-[1.6] text-[#cbc3d7] mt-2">your prep modules are calibrated and ready.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={"// overall score"} glowColor="#d0bcff">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[32px] text-[#d0bcff]">{dashboardData?.averageScore ?? 0}</span>
            <span className="text-[14px] text-[#cbc3d7]">{"/ 100"}</span>
          </div>
          <div className="mt-4">
            {scoreTrend === null ? (
              <span className="font-display text-[14px] tracking-[.05em] text-[#cbc3d7]">{"not enough data"}</span>
            ) : (
              <span className={`font-display text-[14px] tracking-[.05em] flex items-center gap-2 ${scoreTrend >= 0 ? "text-emerald-400" : "text-[#ffb4ab]"}`}>
                {scoreTrend >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                {`${scoreTrend >= 0 ? "+" : ""}${scoreTrend} this week`}
              </span>
            )}
          </div>
        </StatCard>

        <StatCard label={"// interviews"} glowColor="#a3c9ff">
          <span className="font-display text-[32px] text-[#e4e1e8]">{dashboardData?.interviewCount ?? 0}</span>
          <div className="mt-4 font-display text-[14px] tracking-[.05em] text-[#cbc3d7]">{`${weekChart.total} this week`}</div>
        </StatCard>

        <StatCard label={"// streak"} glowColor="#c6c6c7">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[32px] text-[#e4e1e8]">{streak}</span>
            <span className="text-[14px] text-[#cbc3d7]">{streak === 1 ? "day" : "days"}</span>
          </div>
          <div className={`mt-4 font-display text-[14px] tracking-[.05em] flex items-center gap-2 ${streak > 0 ? "text-[#d0bcff]" : "text-[#cbc3d7]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-none ${streak > 0 ? "bg-[#d0bcff] animate-pulse" : "bg-[#494454]"}`} />
            {streak > 0 ? "active" : "inactive"}
          </div>
        </StatCard>

        <StatCard label={"// weak spot"} glowColor="#ffb4ab">
          <span className="font-display text-[24px] leading-tight text-[#ffb4ab] lowercase block truncate">{weakest ? weakest.label : "—"}</span>
          <div className="mt-4 font-display text-[14px] tracking-[.05em] text-[#cbc3d7]">{weakest ? `${weakest.pct} / 100` : "not enough data"}</div>
        </StatCard>
      </section>

      <section className="relative overflow-hidden p-8 rounded-[8px] border border-[#d0bcff]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" style={glassPanel}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(208,188,255,.1), transparent)" }} />
        <div className="relative z-10 min-w-0">
          <span className="text-[12px] font-bold tracking-[.2em] text-[#d0bcff] uppercase mb-2 block">
            {`// behavioral · ${(dashboardData?.user?.favoriteRole || "software engineer").toLowerCase()}`}
          </span>
          <h3 className="font-display text-[26px] sm:text-[32px] text-[#e4e1e8] lowercase m-0">
            {currentInterview ? "continue your interview" : "full mock interview"}
          </h3>
          <p className="text-[14px] text-[#cbc3d7] mt-2">
            {currentInterview
              ? "pick up right where you left off."
              : weakest
              ? `get scored on content, structure & clarity — targets your ${weakest.label} score.`
              : "get scored on communication, technical knowledge, confidence & problem solving."}
          </p>
        </div>
        <button
          onClick={startRecommended}
          disabled={startingRecommended || !!launchingDrill}
          className="relative z-10 bg-[#d0bcff] text-[#3c0091] text-[12px] font-bold tracking-[.2em] uppercase py-4 px-8 hover:bg-[#e9ddff] hover:scale-[1.03] transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-default"
          style={ctaStyle}
        >
          {startingRecommended ? "starting…" : currentInterview ? "continue >>" : "start >>"}
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h4 className="text-[12px] font-bold tracking-[.2em] text-[#e4e1e8] uppercase mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {"// quick drills"}
          </h4>
          <div className="space-y-4">
            {QUICK_DRILLS.map((d) => {
              const isLaunching = launchingDrill === d.tag;
              return (
                <button
                  key={d.tag}
                  onClick={() => startDrill(d)}
                  disabled={!!launchingDrill || startingRecommended}
                  className="w-full text-left p-4 rounded-[4px] border border-[#494454] bg-[#1f1f24] flex items-center justify-between gap-4 hover:bg-[#2a292e] hover:border-[#6f6f7c] hover:scale-[1.01] transition-all duration-200 group cursor-pointer disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-default"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="border border-[#494454] px-2 py-1 font-display text-[10px] uppercase flex-none" style={{ color: d.tagColor }}>
                      {d.tag}
                    </span>
                    <span className="text-[14px] text-[#e4e1e8] truncate">{d.title}</span>
                  </div>
                  <div className="flex items-center gap-4 font-display text-[14px] tracking-[.05em] text-[#cbc3d7] group-hover:text-[#d0bcff] transition-colors flex-none">
                    <span>{isLaunching ? "starting…" : d.meta}</span>
                    {isLaunching ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-[#d0bcff] rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-[12px] font-bold tracking-[.2em] text-[#e4e1e8] uppercase mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {"// score by skill"}
          </h4>
          <div className="p-6 rounded-[4px] border border-[#494454] space-y-8" style={glassPanel}>
            {metricsAgg.length === 0 ? (
              <div className="text-[14px] text-[#cbc3d7] py-4 text-center">complete an interview to see your skill breakdown.</div>
            ) : (
              metricsAgg.map((m) => {
                const isWeak = weakest?.key === m.key;
                const color = isWeak ? "#ffb4ab" : m.pct >= 80 ? "#34d399" : "#d0bcff";
                return (
                  <div key={m.key}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[14px] text-[#e4e1e8]">{m.label}</span>
                      <span className="font-display text-[14px] tracking-[.05em]" style={{ color }}>{m.pct}</span>
                    </div>
                    <SegmentedBar value={m.pct} color={color} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
