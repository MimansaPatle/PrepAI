"use client";

import React, { useState } from 'react';
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

  // Mock server cluster metrics
  const aggregateMetrics = [
    { label: "Total Active Engineers", count: "1,248", change: "+12% this week", icon: <IoPeopleOutline className="text-blue-400" /> },
    { label: "AI Simulations Run", count: "8,432", change: "+420 today", icon: <IoHardwareChipOutline className="text-violet-400" /> },
    { label: "Avg. Evaluation Time", count: "4.2s", change: "-0.8s optimization", icon: <IoTimeOutline className="text-emerald-400" /> },
    { label: "LLM Token Efficiency", count: "98.4%", change: "Optimal baseline", icon: <IoAnalyticsOutline className="text-amber-400" /> }
  ];

  // Mock active data streams 
  const recentUsers = [
    { id: "UID-9082", name: "Mimansa Patle", track: "Frontend Developer", experience: "Fresher", status: "Active Simulation", score: "88%" },
    { id: "UID-7741", name: "Aarav Sharma", track: "Full Stack Developer", experience: "1-2 Years", status: "Idle", score: "74%" },
    { id: "UID-4412", name: "Riya Verma", track: "Backend Developer", experience: "3+ Years", status: "Report Generated", score: "92%" },
    { id: "UID-1109", name: "Karan Johar", track: "Python Developer", experience: "Fresher", status: "Active Simulation", score: "61%" }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
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
              <span className="text-3xl font-bold tracking-tight text-zinc-100 block">{metric.count}</span>
              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-900 inline-block">
                {metric.change}
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
            <h3 className="text-lg font-bold text-zinc-200">Active Engineer Telemetry</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Live monitoring of system sandboxes and interview sessions.</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-full animate-pulse">
            ● Live Streams
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-950/40">
                <th className="py-4 px-6">Engineer</th>
                <th className="py-4 px-6">Track Target</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Pipeline Status</th>
                <th className="py-4 px-6 text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-sm text-zinc-300">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/10 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <IoPersonCircleOutline className="text-2xl text-zinc-600" />
                    <div>
                      <span className="font-medium text-zinc-200 block">{user.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono block">{user.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-zinc-400">{user.track}</td>
                  <td className="py-4 px-6">{user.experience}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      user.status === 'Active Simulation' 
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                        : user.status === 'Idle'
                        ? 'bg-zinc-800 text-zinc-400'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold font-mono text-zinc-200">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}