"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { History, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Brand";
import HistorySkeleton from "./HistorySkeleton";

export default function HistoryView() {
  const router = useRouter();

  const [pastInterviews, setPastInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/interview/history");
        const data = await res.json();
        if (data.success) setPastInterviews(data.interviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const scored = useMemo(
    () => pastInterviews.filter((s) => typeof s.feedback?.score === "number"),
    [pastInterviews]
  );

  const stats = useMemo(() => {
    const total = pastInterviews.length;
    const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b.feedback.score, 0) / scored.length) : 0;
    const best = scored.length ? Math.max(...scored.map((s) => s.feedback.score)) : 0;

    let trend = 0;
    if (scored.length >= 2) {
      const latest = scored[0].feedback.score;
      const restAvg = scored.slice(1).reduce((a, b) => a + b.feedback.score, 0) / (scored.length - 1);
      trend = Math.round(latest - restAvg);
    }

    return { total, avg, best, trend };
  }, [pastInterviews, scored]);

  const now = new Date();
  const filtered = pastInterviews.filter((s) => {
    if (filter === "passed") return (s.feedback?.score ?? 0) >= 70;
    if (filter === "needs") return (s.feedback?.score ?? 0) < 70;
    if (filter === "month") {
      const d = new Date(s.completedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const trendChart = [...scored].slice(0, 5).reverse();

  if (loading) return <HistorySkeleton />;

  return (
    <div className="animate-rise">
      <h1 className="font-extrabold text-[24px] sm:text-[26px] mb-1.5 tracking-[-.8px]">Session history</h1>
      <p className="text-[#8a8a97] text-[12.5px] mb-[22px]">Metrics, configs and AI analytics from your previous simulations.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-[18px]">
        <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">TOTAL SESSIONS</div><div className="font-extrabold text-[23px]">{stats.total}</div></Card>
        <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">AVG PERFORMANCE</div><div className="font-extrabold text-[23px] text-purple-light">{stats.avg}%</div></Card>
        <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">BEST SCORE</div><div className="font-extrabold text-[23px] text-good">{stats.best}%</div></Card>
        <Card className="p-[18px]">
          <div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">TREND</div>
          <div className={`font-extrabold text-[23px] ${stats.trend >= 0 ? "text-good" : "text-bad"}`}>{stats.trend >= 0 ? "▲" : "▼"} {Math.abs(stats.trend)}%</div>
        </Card>
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {[["all", "All"], ["passed", "Passed"], ["needs", "Needs work"], ["month", "This month"]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className="text-[12px] px-[15px] py-[7px] rounded-full cursor-pointer border"
            style={filter === k ? { background: "rgba(139,92,246,.16)", borderColor: "rgba(139,92,246,.3)", color: "#c4b5fd" } : { background: "transparent", borderColor: "rgba(255,255,255,.1)", color: "#8a8a97" }}
          >
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-[#7a7a87] text-[13px]">No interviews match this filter.</Card>
      ) : (
        <div className="space-y-3 mb-6">
          {filtered.map((session) => (
            <div key={session._id} className="flex flex-col sm:flex-row sm:items-center gap-3.5 bg-panel border border-white/[.07] rounded-2xl px-5 py-[17px]">
              <div className="w-10 h-10 rounded-[11px] bg-field flex items-center justify-center text-purple-light flex-none"><History className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <span className="font-semibold text-[14px]">{session.role}</span>
                  <span className="text-[9.5px] px-[7px] py-0.5 rounded-md bg-field text-[#9090a0] uppercase tracking-[.4px]">{session.difficulty}</span>
                </div>
                <div className="text-[11.5px] text-[#6f6f7c]">
                  completed {new Date(session.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <div className="text-[9px] text-[#6f6f7c] tracking-[.4px]">PERFORMANCE</div>
                  <div className={`font-extrabold text-[17px] ${session.feedback?.score >= 70 ? "text-good" : "text-bad"}`}>{session.feedback?.score ?? "--"}%</div>
                </div>
                <button onClick={() => router.push(`/feedback?id=${session._id}`)} className="inline-flex items-center gap-1 bg-field border border-white/[.1] text-[#f2f2f5] px-[15px] py-[9px] rounded-[10px] text-[12px]">
                  Review <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {trendChart.length > 1 && (
        <Card className="p-[22px] sm:p-[24px]">
          <div className="flex items-center justify-between mb-[22px]">
            <span className="font-semibold text-[14px]">Performance trend</span>
            <span className={`text-[11px] ${stats.trend >= 0 ? "text-good" : "text-bad"}`}>{stats.trend >= 0 ? "▲ improving" : "▼ declining"}</span>
          </div>
          <div className="flex items-end gap-3.5 sm:gap-[18px] h-[150px]">
            {trendChart.map((s) => (
              <div key={s._id} className="flex-1 flex flex-col items-center gap-[9px] h-full justify-end">
                <span className="text-[11px] font-bold" style={{ color: s.feedback.score >= 70 ? "#34d399" : "#f87171" }}>{s.feedback.score}%</span>
                <div className="w-full rounded-t-[7px]" style={{ height: `${s.feedback.score}%`, background: "linear-gradient(180deg,#8b5cf6,#5b9be8)", minHeight: 6 }} />
                <span className="text-[10.5px] text-[#7a7a87]">{new Date(s.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
