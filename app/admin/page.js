"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Brand";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dow);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function AdminDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({ totalUsers: 0, totalInterviews: 0, completedInterviews: 0, averageScore: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [openTickets, setOpenTickets] = useState(0);

  const loadAll = async () => {
    try {
      const [dashRes, interviewsRes, usersRes, supportRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/interviews"),
        fetch("/api/admin/users"),
        fetch("/api/admin/support"),
      ]);

      const dash = await dashRes.json();
      const interviewsData = await interviewsRes.json();
      const usersData = await usersRes.json();
      const supportData = await supportRes.json();

      if (dash.success) {
        setMetrics(dash.metrics);
        setRecentUsers(dash.recentUsers);
      }
      if (interviewsData.success) setInterviews(interviewsData.interviews);
      if (usersData.success) setUsers(usersData.users);
      if (supportData.success) setOpenTickets(supportData.messages.filter((m) => m.status !== "resolved").length);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const today = new Date();
  const weekStart = startOfWeek(today);

  const usersThisWeek = useMemo(
    () => users.filter((u) => u.joinedAt && new Date(u.joinedAt) >= weekStart).length,
    [users, weekStart]
  );

  const interviewsThisWeek = useMemo(
    () => interviews.filter((iv) => iv.createdAt && new Date(iv.createdAt) >= weekStart).length,
    [interviews, weekStart]
  );

  const interviewsToday = useMemo(
    () => interviews.filter((iv) => iv.createdAt && isSameDay(new Date(iv.createdAt), today)).length,
    [interviews]
  );

  const weekChart = useMemo(() => {
    const buckets = DAY_LABELS.map((label, i) => {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const count = interviews.filter((iv) => {
        if (!iv.createdAt) return false;
        const d = new Date(iv.createdAt);
        return d >= dayStart && d < dayEnd;
      }).length;

      return { label, count };
    });
    const max = Math.max(1, ...buckets.map((b) => b.count));
    return { buckets, max };
  }, [interviews, weekStart]);

  const topRoles = useMemo(() => {
    const counts = {};
    interviews.forEach((iv) => {
      if (!iv.role) return;
      counts[iv.role] = (counts[iv.role] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const max = Math.max(1, ...entries.map(([, c]) => c));
    return entries.map(([role, count]) => ({ role, count, pct: Math.round((count / max) * 100) }));
  }, [interviews]);

  const avgSessionLength = useMemo(() => {
    const durations = interviews
      .filter((iv) => iv.status === "completed" && iv.createdAt && iv.completedAt)
      .map((iv) => new Date(iv.completedAt) - new Date(iv.createdAt))
      .filter((ms) => ms > 0);

    if (durations.length === 0) return "—";

    const avgMs = durations.reduce((a, b) => a + b, 0) / durations.length;
    const mins = Math.floor(avgMs / 60000);
    const secs = Math.round((avgMs % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }, [interviews]);

  const completionRate = metrics.totalInterviews > 0 ? Math.round((metrics.completedInterviews / metrics.totalInterviews) * 100) : 0;

  const stats = [
    { label: "TOTAL USERS", value: metrics.totalUsers, delta: `▲ ${usersThisWeek} this week`, color: "#f2f2f5", tint: "rgba(139,92,246,.14)", dot: "#a78bfa" },
    { label: "INTERVIEWS RUN", value: metrics.totalInterviews, delta: `▲ ${interviewsThisWeek} this week`, color: "#a78bfa", tint: "rgba(139,92,246,.14)", dot: "#8b5cf6" },
    { label: "STARTED TODAY", value: interviewsToday, delta: `${completionRate}% completion rate`, color: "#34d399", tint: "rgba(52,211,153,.14)", dot: "#34d399" },
    { label: "OPEN TICKETS", value: openTickets, delta: openTickets > 0 ? "awaiting reply" : "all clear", color: "#f87171", tint: "rgba(248,113,113,.14)", dot: "#f87171" },
  ];

  const health = [
    ["Completion rate", `${completionRate}%`, "#34d399"],
    ["Avg session length", avgSessionLength, "#f2f2f5"],
    ["New users this week", usersThisWeek, "#a78bfa"],
    ["Avg AI score", `${metrics.averageScore}%`, "#5b9be8"],
  ];

  return (
    <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="font-extrabold text-[24px] sm:text-[26px] tracking-[-.8px]">Admin console</h1>
          <p className="text-[#8a8a97] text-[12.5px] mt-1">Platform analytics, user oversight and support ops.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 border-0 text-white px-4 py-2.5 rounded-xl text-[12.5px] font-semibold disabled:opacity-60 self-start"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
        >
          {refreshing ? "syncing…" : "sync data"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-[18px]">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-[#7a7a87] tracking-[.6px]">{s.label}</span>
              <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: s.tint }}>
                <span className="w-2 h-2 rounded-[3px]" style={{ background: s.dot }} />
              </span>
            </div>
            <div className="font-extrabold text-[25px]" style={{ color: s.color }}>{loading ? "…" : s.value}</div>
            <div className="text-[11px] text-good mt-2">{loading ? "" : s.delta}</div>
          </Card>
        ))}
      </div>

      <Card className="p-[22px] sm:p-[24px] mb-[18px]">
        <div className="font-semibold text-[15px] mb-[22px]">Interviews this week</div>
        <div className="flex items-end gap-3 sm:gap-3.5 h-[170px]">
          {weekChart.buckets.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
              <div
                className="w-full rounded-t-lg"
                style={{ height: `${Math.max(6, (b.count / weekChart.max) * 100)}%`, background: b.count > 0 ? "linear-gradient(180deg,#8b5cf6,#5b9be8)" : "rgba(255,255,255,.06)" }}
              />
              <span className="text-[11px] text-[#7a7a87] uppercase">{b.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-[18px]">
        <Card className="p-[22px]">
          <div className="font-semibold text-[14px] mb-[18px]">Top roles practiced</div>
          {topRoles.length === 0 ? (
            <div className="text-[12.5px] text-[#7a7a87]">No interviews yet.</div>
          ) : (
            topRoles.map((r) => (
              <div key={r.role} className="mb-3.5 last:mb-0">
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="text-[#c4c4cf]">{r.role}</span>
                  <span className="text-[#8a8a97]">{r.count}</span>
                </div>
                <div className="h-[7px] bg-field rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "linear-gradient(90deg,#8b5cf6,#5b9be8)" }} />
                </div>
              </div>
            ))
          )}
        </Card>

        <Card className="p-[22px]">
          <div className="font-semibold text-[14px] mb-3">Platform health</div>
          {health.map(([l, v, c]) => (
            <div key={l} className="flex items-center justify-between py-[11px] border-b border-white/[.05] last:border-0">
              <span className="text-[12.5px] text-[#8a8a97]">{l}</span>
              <span className="text-[13px] font-semibold" style={{ color: c }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[.07]">
          <div className="font-semibold text-[15px]">Recent users</div>
          <p className="text-[11.5px] text-[#7a7a87] mt-1">Recently registered users and their interview performance.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[.07] text-[#7a7a87] text-[10px] uppercase tracking-[.5px] bg-field/60">
                <th className="py-3.5 px-5 sm:px-6">User</th>
                <th className="py-3.5 px-5 sm:px-6">Target role</th>
                <th className="py-3.5 px-5 sm:px-6">Experience</th>
                <th className="py-3.5 px-5 sm:px-6">Interviews</th>
                <th className="py-3.5 px-5 sm:px-6 text-right">Avg score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[.05] text-[13px] text-[#c4c4cf]">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-3.5 px-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-[9px] flex-none" style={{ background: "linear-gradient(135deg,#8b5cf6,#5b9be8)" }} />
                      <div>
                        <div className="font-medium text-[#e6e6ec]">{user.name}</div>
                        <div className="text-[10.5px] text-[#6f6f7c]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 sm:px-6 text-[12px] text-[#9090a0]">{user.track}</td>
                  <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.experience}</td>
                  <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.interviews}</td>
                  <td className="py-3.5 px-5 sm:px-6 text-right font-semibold text-purple-light">{user.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
