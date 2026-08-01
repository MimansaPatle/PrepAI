"use client";

import React, { useEffect, useState } from "react";
import {
  IoAnalyticsOutline,
  IoPeopleOutline,
  IoHardwareChipOutline,
  IoTimeOutline,
  IoShieldCheckmarkOutline,
  IoRefreshOutline,
  IoPersonCircleOutline,
  IoArrowBackOutline
} from 'react-icons/io5';

export default function AdminDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");

      const data = await res.json();

      if (data.success) {
        setMetrics(data.metrics);
        setRecentUsers(data.recentUsers);
      }
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Mock server cluster metrics
  const aggregateMetrics = [
    {
      label: "Total Users",
      count: metrics.totalUsers,
      icon: <IoPeopleOutline className="text-blue-400" />,
    },
    {
      label: "Total Interviews",
      count: metrics.totalInterviews,
      icon: <IoHardwareChipOutline className="text-violet-400" />,
    },
    {
      label: "Completed Interviews",
      count: metrics.completedInterviews,
      icon: <IoShieldCheckmarkOutline className="text-emerald-400" />,
    },
    {
      label: "Average Score",
      count: `${metrics.averageScore}%`,
      icon: <IoAnalyticsOutline className="text-amber-400" />,
    },
  ];

  // Mock active data streams 


  const handleRefresh = async () => {
    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30 p-6 md:p-12 space-y-8">
      {/* Admin Control Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
            <IoShieldCheckmarkOutline className="text-violet-500" /> Central Root Console
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">PrepAI System Admin</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Observe live system parameters, workspace state engines, and metrics pipelines.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium px-4 py-2.5 rounded-xl text-sm border border-zinc-800 transition"
          >
            <IoArrowBackOutline /> Exit to App
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-violet-600/10"
          >
            <IoRefreshOutline className={`text-base ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>
        </div>
      </header>

      {/* Aggregate Monitor Matrix Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aggregateMetrics.map((metric, idx) => (
          <div key={idx} className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-500 block truncate">{metric.label}</span>
              <span className="text-3xl font-bold tracking-tight text-zinc-100 block">
                {loading ? "..." : metric.count}
              </span>

            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-xl">
              {metric.icon}
            </div>
          </div>
        ))}
      </section>

      {/* User Session Grid */}
      <section className="bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/10">
          <div>
            <h3 className="text-lg font-bold text-zinc-200">
              Recent Users
            </h3>

            <p className="text-xs text-zinc-500 mt-0.5">
              Recently registered users and their interview performance.
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-950/40">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Target Role</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Interviews</th>
                <th className="py-4 px-6 text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-sm text-zinc-300">
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-900/10 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <IoPersonCircleOutline className="text-2xl text-zinc-600" />

                      <div>
                        <span className="font-medium text-zinc-200 block">
                          {user.name}
                        </span>

                        <span className="text-[10px] text-zinc-500 block">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                    {user.track}
                  </td>

                  <td className="py-4 px-6">
                    {user.experience}
                  </td>

                  <td className="py-4 px-6">
                    {user.interviews}
                  </td>

                  <td className="py-4 px-6 text-right font-semibold font-mono text-zinc-200">
                    {user.score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}