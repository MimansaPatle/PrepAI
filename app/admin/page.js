"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PageHeader, ActionButton, Panel, StatTile, Avatar } from "@/components/AdminUI";

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
    { label: "total users", value: metrics.totalUsers, delta: `▲ ${usersThisWeek} this week`, color: "#e4e1e8" },
    { label: "interviews run", value: metrics.totalInterviews, delta: `▲ ${interviewsThisWeek} this week`, color: "#d0bcff" },
    { label: "started today", value: interviewsToday, delta: `${completionRate}% completion rate`, color: "#34d399" },
    { label: "open tickets", value: openTickets, delta: openTickets > 0 ? "awaiting reply" : "all clear", color: openTickets > 0 ? "#ffb4ab" : "#34d399" },
  ];

  const health = [
    ["completion rate", `${completionRate}%`, "#34d399"],
    ["avg session length", avgSessionLength, "#e4e1e8"],
    ["new users this week", usersThisWeek, "#d0bcff"],
    ["avg AI score", `${metrics.averageScore}%`, "#a3c9ff"],
  ];

  return (
    <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise">
      <PageHeader
        eyebrow="admin console"
        title="platform overview"
        description="analytics, user oversight and support."
        action={
          <ActionButton onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "syncing…" : "refresh"}
          </ActionButton>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-3.5">
        {stats.map((s) => (
          <StatTile key={s.label} label={s.label} value={loading ? "…" : s.value} delta={loading ? undefined : s.delta} color={s.color} />
        ))}
      </div>

      <Panel className="p-[22px] sm:p-[24px] mb-3.5">
        <span className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase block mb-6">{"// interviews this week"}</span>
        <div className="flex items-end gap-3 sm:gap-3.5 h-[170px]">
          {weekChart.buckets.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
              <div
                className="w-full"
                style={{ height: `${Math.max(6, (b.count / weekChart.max) * 100)}%`, background: b.count > 0 ? "#d0bcff" : "#2a292e" }}
              />
              <span className="text-[10.5px] font-bold text-[#6f6f7c] uppercase tracking-[.2em]">{b.label}</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
        <Panel className="p-[22px]">
          <span className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase block mb-5">{"// top roles practiced"}</span>
          {topRoles.length === 0 ? (
            <div className="text-[12.5px] text-[#6f6f7c]">no interviews yet.</div>
          ) : (
            topRoles.map((r) => (
              <div key={r.role} className="mb-4 last:mb-0">
                <div className="flex justify-between text-[12px] mb-2">
                  <span className="text-[#cbc3d7]">{r.role}</span>
                  <span className="text-[#6f6f7c]">{r.count}</span>
                </div>
                <div className="h-[6px] bg-[#2a292e]">
                  <div className="h-full" style={{ width: `${r.pct}%`, background: "#d0bcff" }} />
                </div>
              </div>
            ))
          )}
        </Panel>

        <Panel className="p-[22px]">
          <span className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase block mb-4">{"// platform health"}</span>
          {health.map(([l, v, c]) => (
            <div key={l} className="flex items-center justify-between py-3 border-b border-[#2a292e] last:border-0">
              <span className="text-[12.5px] text-[#8a8a97]">{l}</span>
              <span className="font-display text-[14px] tracking-[.05em]" style={{ color: c }}>{v}</span>
            </div>
          ))}
        </Panel>
      </div>

      <Panel className="overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#494454]">
          <span className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase block">{"// recent users"}</span>
          <p className="text-[11.5px] text-[#6f6f7c] mt-1.5">recently registered users and their interview performance.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#494454] text-[#6f6f7c] text-[10px] font-bold uppercase tracking-[.2em]">
                <th className="py-3.5 px-5 sm:px-6">user</th>
                <th className="py-3.5 px-5 sm:px-6">target role</th>
                <th className="py-3.5 px-5 sm:px-6">experience</th>
                <th className="py-3.5 px-5 sm:px-6">interviews</th>
                <th className="py-3.5 px-5 sm:px-6 text-right">avg score</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#2a292e] last:border-0 text-[13px] text-[#cbc3d7]">
                  <td className="py-3.5 px-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <div>
                        <div className="font-medium text-[#e4e1e8]">{user.name}</div>
                        <div className="text-[10.5px] text-[#6f6f7c]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 sm:px-6 text-[12px] text-[#9090a0]">{user.track}</td>
                  <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.experience}</td>
                  <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.interviews}</td>
                  <td className="py-3.5 px-5 sm:px-6 text-right font-display text-[13px] tracking-[.05em] text-[#d0bcff]">{user.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
