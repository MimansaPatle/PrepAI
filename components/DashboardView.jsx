"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Play, History, User, ChevronRight, Target, Star, RotateCcw } from "lucide-react";
import { Robot, Card, Label } from "@/components/ui/Brand";
import DashboardSkeleton from "./DashboardSkeleton";

const METRIC_META = {
  communication: { label: "Communication", color: "#5b9be8" },
  technicalKnowledge: { label: "Technical knowledge", color: "#8b5cf6" },
  confidence: { label: "Confidence", color: "#a78bfa" },
  problemSolving: { label: "Problem solving", color: "#34d399" },
};

export default function Dashboard() {
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(true);
  const [allInterviews, setAllInterviews] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const isPageLoading = loadingDashboard || loadingInterview || loadingHistory;

  const userName = dashboardData?.user?.name || "User";

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

  const recentInterviews = allInterviews.slice(0, 4);

  const weekChart = useMemo(() => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - dayOfWeek);

    const counts = days.map((label, i) => {
      const dayStart = new Date(monday);
      dayStart.setDate(monday.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const count = allInterviews.filter((iv) => {
        if (!iv.completedAt) return false;
        const d = new Date(iv.completedAt);
        return d >= dayStart && d < dayEnd;
      }).length;

      return { label, count };
    });

    const max = Math.max(1, ...counts.map((c) => c.count));
    const total = counts.reduce((a, c) => a + c.count, 0);
    return { counts, max, total };
  }, [allInterviews]);

  const streak = useMemo(() => {
    const daySet = new Set(
      allInterviews
        .filter((iv) => iv.completedAt)
        .map((iv) => new Date(iv.completedAt).toDateString())
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

    return Object.keys(sums)
      .map((key) => ({
        key,
        label: METRIC_META[key].label,
        color: METRIC_META[key].color,
        pct: Math.round((sums[key] / n / 5) * 100),
      }))
      .sort((a, b) => a.pct - b.pct);
  }, [allInterviews]);

  const recommendations = useMemo(() => {
    const cards = [];

    if (metricsAgg.length > 0) {
      const weakest = metricsAgg[0];
      cards.push({
        icon: Target,
        title: weakest.label,
        tag: weakest.pct < 50 ? "Hard" : "Medium",
        tint: "rgba(139,92,246,.14)",
        color: "#a78bfa",
        desc: "Your weakest competency — biggest score lift.",
        action: () => router.push("/interview"),
      });
    }

    if (dashboardData?.user?.favoriteRole) {
      cards.push({
        icon: Star,
        title: dashboardData.user.favoriteRole,
        tag: "Preferred",
        tint: "rgba(52,211,153,.12)",
        color: "#34d399",
        desc: "Continue building on your strongest track.",
        action: () => router.push("/interview"),
      });
    }

    const scored = allInterviews.filter((iv) => typeof iv.feedback?.score === "number");
    if (scored.length > 0) {
      const lowest = [...scored].sort((a, b) => a.feedback.score - b.feedback.score)[0];
      cards.push({
        icon: RotateCcw,
        title: lowest.role,
        tag: lowest.difficulty,
        tint: "rgba(248,113,113,.12)",
        color: "#f87171",
        desc: `Your lowest scoring session (${lowest.feedback.score}%) — retry it.`,
        action: () => router.push("/interview"),
      });
    }

    return cards.slice(0, 3);
  }, [metricsAgg, dashboardData, allInterviews, router]);

  if (isPageLoading) return <DashboardSkeleton />;

  const stats = [
    { label: "OVERALL SCORE", value: `${dashboardData?.averageScore ?? 0}%`, color: "#34d399", size: "27px", sub: "average ai score", tint: "rgba(52,211,153,.14)", dot: "#34d399" },
    { label: "INTERVIEWS", value: `${dashboardData?.interviewCount ?? 0}`, color: "#f2f2f5", size: "27px", sub: "completed", tint: "rgba(139,92,246,.14)", dot: "#a78bfa" },
    { label: "STREAK", value: `${streak} day${streak === 1 ? "" : "s"}`, color: streak > 0 ? "#5b9be8" : "#f2f2f5", size: "24px", sub: "daily practice", tint: "rgba(91,155,232,.14)", dot: "#5b9be8" },
    { label: "FAVORITE ROLE", value: dashboardData?.user?.favoriteRole || "—", color: "#f2f2f5", size: "18px", sub: "preferred", tint: "rgba(248,113,113,.14)", dot: "#f87171" },
  ];

  const scoreColor = (score) => (score >= 80 ? "#34d399" : score >= 60 ? "#f2f2f5" : "#f87171");

  return (
    <div className="animate-rise">
      <div className="flex items-center gap-4 mb-[26px]">
        <Robot v="a" className="w-[60px] h-auto flex-none animate-bob" />
        <div>
          <h1 className="font-extrabold text-[26px] sm:text-[28px] mb-1 tracking-[-1px]">welcome back, <span className="text-purple-light">{userName}</span></h1>
          <p className="text-[#8a8a97] text-[13px]">your prep modules are calibrated and ready.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
        {stats.map((d) => (
          <Card key={d.label} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-[#7a7a87] tracking-[.6px]">{d.label}</span>
              <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: d.tint }}>
                <span className="w-2 h-2 rounded-[3px]" style={{ background: d.dot }} />
              </span>
            </div>
            <div className="font-extrabold leading-[1.05] truncate" style={{ fontSize: d.size, color: d.color }}>{d.value}</div>
            <div className="text-[11px] text-[#6f6f7c] mt-2">{d.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-[22px] mb-[22px]">
        <div>
          <Label>// quick actions</Label>
          <button
            onClick={() => router.push(currentInterview ? `/interviewsession?id=${currentInterview._id}` : "/interview")}
            className="flex items-center gap-3.5 w-full text-left border-0 text-white p-[17px] rounded-[15px] cursor-pointer mb-[11px]"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", boxShadow: "0 10px 28px rgba(124,58,237,.3)" }}
          >
            <span className="w-[38px] h-[38px] rounded-[11px] bg-white/[.18] flex items-center justify-center flex-none">
              <Play className="w-4 h-4 text-white fill-white" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-[14px]">{currentInterview ? "Continue interview" : "Start new interview"}</span>
              <span className="block text-[11.5px] text-white/70">{currentInterview ? "Resume your unfinished session" : "Initialize simulator workspace"}</span>
            </span>
            <span className="text-white/70">→</span>
          </button>

          <button onClick={() => router.push("/history")} className="flex items-center gap-3.5 w-full text-left bg-panel border border-white/[.07] text-[#f2f2f5] p-[17px] rounded-[15px] cursor-pointer mb-[11px]">
            <span className="w-[38px] h-[38px] rounded-[11px] bg-field flex items-center justify-center flex-none text-purple-light"><History className="w-4 h-4" /></span>
            <span className="flex-1">
              <span className="block font-semibold text-[14px]">Interview history</span>
              <span className="block text-[11.5px] text-[#8a8a97]">Review past records</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#6f6f7c]" />
          </button>

          <button onClick={() => router.push("/profile")} className="flex items-center gap-3.5 w-full text-left bg-panel border border-white/[.07] text-[#f2f2f5] p-[17px] rounded-[15px] cursor-pointer mb-[11px]">
            <span className="w-[38px] h-[38px] rounded-[11px] bg-field flex items-center justify-center flex-none text-[#5b9be8]"><User className="w-4 h-4" /></span>
            <span className="flex-1">
              <span className="block font-semibold text-[14px]">Your profile</span>
              <span className="block text-[11.5px] text-[#8a8a97]">Calibrate targets</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#6f6f7c]" />
          </button>

          <Card className="p-[18px]">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] text-[#7a7a87] tracking-[.6px]">THIS WEEK</span>
              <span className="text-[11px] text-good">{weekChart.total} session{weekChart.total === 1 ? "" : "s"}</span>
            </div>
            <div className="flex items-end gap-2 h-[70px]">
              {weekChart.counts.map((c, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-[6px]"
                    style={{
                      height: `${Math.max(10, (c.count / weekChart.max) * 100)}%`,
                      background: c.count > 0 ? "linear-gradient(180deg,#8b5cf6,#5b9be8)" : "rgba(255,255,255,.06)",
                    }}
                  />
                  <span className="text-[10px] text-[#7a7a87]">{c.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Label>// recent interviews</Label>
          {recentInterviews.length === 0 ? (
            <Card className="p-6 text-center text-[#7a7a87] text-[13px]">No interviews completed yet.</Card>
          ) : (
            recentInterviews.map((r, idx) => (
              <div
                key={r._id}
                onClick={() => router.push(`/feedback?id=${r._id}`)}
                className="flex items-center gap-3.5 bg-panel border border-white/[.07] rounded-[15px] px-[18px] py-[15px] mb-[11px] cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-[5px] flex-wrap">
                    <span className="font-semibold text-[13.5px]">{r.role}</span>
                    <span className="text-[9.5px] px-[7px] py-0.5 rounded-md bg-field text-[#9090a0] uppercase tracking-[.4px]">{r.difficulty}</span>
                    {idx === 0 && <span className="text-[9.5px] px-[7px] py-0.5 rounded-md" style={{ background: "rgba(139,92,246,.16)", color: "#c4b5fd" }}>latest</span>}
                  </div>
                  <div className="text-[11.5px] text-[#6f6f7c]">
                    completed {new Date(r.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-[#6f6f7c] tracking-[.4px]">AI SCORE</div>
                  <div className="font-extrabold text-[19px]" style={{ color: scoreColor(r.feedback?.score ?? 0) }}>{r.feedback?.score ?? "--"}%</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(recommendations.length > 0 || metricsAgg.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_.65fr] gap-[18px]">
          {recommendations.length > 0 && (
            <div>
              <Label>// recommended next</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendations.map((r, i) => (
                  <Card key={i} className="p-[18px] cursor-pointer" onClick={r.action}>
                    <span className="w-8 h-8 rounded-[10px] flex items-center justify-center mb-3" style={{ background: r.tint, color: r.color }}><r.icon className="w-4 h-4" /></span>
                    <div className="font-semibold text-[13px] mb-0.5 truncate">{r.title}</div>
                    <div className="text-[9.5px] uppercase tracking-[.4px] text-[#7a7a87] mb-2">{r.tag}</div>
                    <div className="text-[11px] text-[#8a8a97] leading-[1.5]">{r.desc}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {metricsAgg.length > 0 && (
            <div>
              <Label>// skills to sharpen</Label>
              <Card className="p-[18px]">
                {metricsAgg.map((m) => (
                  <div key={m.key} className="mb-3.5 last:mb-0">
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="text-[#c4c4cf]">{m.label}</span>
                      <span className="font-semibold" style={{ color: m.color }}>{m.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-field rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
                <div className="text-[10.5px] text-[#6f6f7c] mt-3.5 pt-3.5 border-t border-white/[.06] leading-[1.5]">
                  Practicing {metricsAgg[0].label.toLowerCase()} lifts your overall readiness the fastest.
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
