"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, TrendingUp, TrendingDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import HistorySkeleton from "./HistorySkeleton";

const PAGE_SIZE = 4;

const DIFFICULTY_META = {
  Easy: { blocks: 2, color: "#a3c9ff" },
  Medium: { blocks: 3, color: "#d0bcff" },
  Hard: { blocks: 4, color: "#ffb4ab" },
};

const panelStyle = { background: "#1f1f24" };

export default function HistoryView() {
  const router = useRouter();
  const { showToast } = useToast();

  const [pastInterviews, setPastInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [starting, setStarting] = useState(false);

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
    return { total, avg, best };
  }, [pastInterviews, scored]);

  const bestSession = useMemo(() => {
    if (scored.length === 0) return null;
    return [...scored].sort((a, b) => b.feedback.score - a.feedback.score)[0];
  }, [scored]);

  const weakestSession = useMemo(() => {
    if (scored.length === 0) return null;
    return [...scored].sort((a, b) => a.feedback.score - b.feedback.score)[0];
  }, [scored]);

  const monthTrend = useMemo(() => {
    const inMonth = (d, ref) => d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    const now = new Date();
    const thisMonth = pastInterviews.filter((iv) => iv.completedAt && inMonth(new Date(iv.completedAt), now)).length;
    const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = pastInterviews.filter((iv) => iv.completedAt && inMonth(new Date(iv.completedAt), lastMonthRef)).length;
    if (lastMonth === 0) return { pct: null };
    return { pct: Math.round(((thisMonth - lastMonth) / lastMonth) * 100) };
  }, [pastInterviews]);

  const syncPct = pastInterviews.length ? ((scored.length / pastInterviews.length) * 100).toFixed(1) : "100.0";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pastInterviews;
    return pastInterviews.filter(
      (iv) => iv.role?.toLowerCase().includes(q) || iv.difficulty?.toLowerCase().includes(q)
    );
  }, [pastInterviews, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pageWindow = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, safePage - 2);
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, safePage]);

  const startRecommended = async () => {
    if (!weakestSession || starting) return;
    setStarting(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: weakestSession.role,
          experience: weakestSession.experience,
          difficulty: weakestSession.difficulty,
          skills: weakestSession.skills || "",
          company: weakestSession.company || "",
        }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast?.({ title: "couldn't start interview", description: data.message || "please try again." });
        setStarting(false);
        return;
      }

      router.push(`/interviewsession?id=${data.interviewId}`);
    } catch (err) {
      console.error(err);
      showToast?.({ title: "something went wrong", description: "please try again." });
      setStarting(false);
    }
  };

  if (loading) return <HistorySkeleton />;

  return (
    <div className="animate-rise flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#494454] pb-5 gap-4">
        <div>
          <h1
            className="font-display text-[26px] sm:text-[32px] text-[#e4e1e8] uppercase tracking-[.02em] mb-2"
            style={{ textShadow: "0 0 10px rgba(208,188,255,.5)" }}
          >
            {"interview history"}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#cbc3d7]">Review your past practice interviews.</p>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-display tracking-[.05em] text-[#958ea0] border border-[#494454] px-4 py-2 flex-none" style={{ background: "#1b1b20" }}>
          <RefreshCw className="w-3.5 h-3.5" />
          {`loaded: ${syncPct}%`}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden p-6 border border-[#494454] group hover:border-[#d0bcff]/50 transition-colors" style={panelStyle}>
          <div className="text-[12px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4">{"// total sessions"}</div>
          <div className="font-display text-[42px] leading-none text-[#d0bcff]" style={{ textShadow: "0 0 10px rgba(208,188,255,.5)" }}>{stats.total}</div>
          <div
            className="mt-4 flex items-center gap-1.5 font-display text-[14px] tracking-[.05em]"
            style={{ color: monthTrend.pct === null ? "#958ea0" : monthTrend.pct >= 0 ? "#a3c9ff" : "#ffb4ab" }}
          >
            {monthTrend.pct !== null && (monthTrend.pct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />)}
            {monthTrend.pct === null ? "no sessions last month" : `${monthTrend.pct >= 0 ? "+" : ""}${monthTrend.pct}% vs last month`}
          </div>
        </div>

        <div className="relative overflow-hidden p-6 border border-[#494454] group hover:border-[#a3c9ff]/50 transition-colors" style={panelStyle}>
          <div className="text-[12px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4">{"// average score"}</div>
          <div className="font-display text-[42px] leading-none text-[#a3c9ff]" style={{ textShadow: "0 0 10px rgba(163,201,255,.5)" }}>
            {stats.avg}<span className="text-[24px]">%</span>
          </div>
          <div className="mt-4 flex gap-1 h-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="flex-1" style={{ background: i < Math.round((stats.avg / 100) * 5) ? "#a3c9ff" : "#494454" }} />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden p-6 border border-[#494454] group hover:border-[#d0bcff]/50 transition-colors" style={panelStyle}>
          <div className="text-[12px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4">{"// best score"}</div>
          <div className="font-display text-[42px] leading-none text-[#e4e1e8]">
            {stats.best}<span className="text-[24px]">%</span>
          </div>
          <div className="font-display text-[14px] tracking-[.05em] text-[#958ea0] mt-4 truncate">{bestSession ? bestSession.role : "not enough data"}</div>
        </div>

        <div className="relative overflow-hidden p-6 border border-[#494454] group hover:border-[#d0bcff]/50 transition-colors flex flex-col justify-between" style={panelStyle}>
          <div>
            <div className="text-[12px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-4">{"// recommended next"}</div>
            <div className="font-display text-[20px] leading-tight text-[#e4e1e8] truncate">{weakestSession ? weakestSession.role : "—"}</div>
            {weakestSession && (
              <div className="text-[12px] text-[#958ea0] mt-1.5">{`retry · ${weakestSession.difficulty.toLowerCase()} · ${weakestSession.feedback.score}%`}</div>
            )}
          </div>
          <button
            onClick={startRecommended}
            disabled={!weakestSession || starting}
            className="mt-4 w-full border border-[#494454] text-[#e4e1e8] text-[12px] font-bold tracking-[.2em] uppercase py-2.5 hover:bg-[#2a292e] transition-colors disabled:opacity-50 disabled:cursor-default cursor-pointer"
          >
            {starting ? "starting…" : "start >>"}
          </button>
        </div>
      </section>

      <section className="border border-[#494454] flex-1 flex flex-col min-h-[420px]" style={panelStyle}>
        <div className="p-4 border-b border-[#494454] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3" style={{ background: "#1b1b20" }}>
          <div className="text-[12px] font-bold tracking-[.2em] text-[#d0bcff] uppercase">{"// interview log"}</div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#958ea0] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="search by role or difficulty…"
              className="bg-[#131317] border-b border-[#494454] focus:border-[#d0bcff] outline-none text-[13px] pl-8 pr-3 py-2 w-full sm:w-52 text-[#e4e1e8] placeholder:text-[#6f6f7c] uppercase tracking-[.05em] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-[#494454]" style={{ background: "rgba(31,31,36,.5)" }}>
                <th className="p-4 text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase w-12">#</th>
                <th className="p-4 text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase">{"role / target"}</th>
                <th className="p-4 text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase">difficulty</th>
                <th className="p-4 text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase">score</th>
                <th className="p-4 text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase">{"date / timestamp"}</th>
                <th className="p-4 text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase text-right">action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((session, i) => {
                const meta = DIFFICULTY_META[session.difficulty] || DIFFICULTY_META.Medium;
                const score = session.feedback?.score;
                return (
                  <tr key={session._id} className="border-b border-[#494454]/40 hover:bg-[#2a292e]/50 transition-colors group">
                    <td className="p-4 text-[13px] text-[#958ea0] font-display">{String((safePage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}</td>
                    <td className="p-4 text-[14px] text-[#e4e1e8]">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full flex-none" style={{ background: meta.color, boxShadow: `0 0 5px ${meta.color}` }} />
                        {session.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, b) => (
                          <span key={b} className="w-2 h-4" style={{ background: b < meta.blocks ? meta.color : "#494454" }} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-display text-[14px] tracking-[.05em]" style={{ color: typeof score === "number" ? (score >= 70 ? "#34d399" : "#ffb4ab") : "#958ea0" }}>
                      {typeof score === "number" ? `${score}%` : "—"}
                    </td>
                    <td className="p-4 text-[13px] text-[#958ea0] font-display tracking-[.05em]">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "")
                        : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => router.push(`/feedback?id=${session._id}`)}
                        className="text-[12px] font-bold tracking-[.15em] uppercase text-[#d0bcff] hover:text-[#e9ddff] sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {"view report >>"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-10 text-center text-[14px] text-[#958ea0]">no sessions match your filter.</div>
          )}
        </div>

        <div className="p-4 mt-auto border-t border-[#494454] flex flex-col sm:flex-row justify-between items-center gap-3 text-[#958ea0]">
          <span className="font-display text-[14px] tracking-[.05em]">
            {filtered.length === 0
              ? "showing 0 of 0"
              : `showing ${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#494454] hover:bg-[#2a292e] disabled:opacity-40 disabled:cursor-default cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageWindow.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 flex items-center justify-center border text-[13px] cursor-pointer transition-colors"
                style={n === safePage ? { borderColor: "#d0bcff", color: "#d0bcff", background: "rgba(208,188,255,.1)" } : { borderColor: "#494454", color: "#958ea0" }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#494454] hover:bg-[#2a292e] disabled:opacity-40 disabled:cursor-default cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
