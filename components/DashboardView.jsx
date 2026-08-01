"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Trophy,
  Flame,
  Building,
  Activity,
  ChevronRight,
  Play,
  History,
  User,
  ArrowRight
} from "lucide-react";
import DashboardSkeleton from "./DashboardSkeleton";

export default function Dashboard({ onAction }) {
  // Mock data for user's dashboard metrics
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(true);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const isPageLoading =
    loadingDashboard ||
    loadingInterview ||
    loadingHistory;

  const userName = dashboardData?.user?.name || "User";
  useEffect(() => {
    async function loadCurrentInterview() {
      try {
        const res = await fetch("/api/interview/current");
        const data = await res.json();

        if (data.success) {
          setCurrentInterview(data.interview);
        }
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

        if (data.success) {
          setDashboardData(data);
        }
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

        if (data.success) {
          // Only keep the latest 3 interviews
          setRecentInterviews(data.interviews.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, []);

  const stats = [
    {
      label: "Overall Score",
      value: `${dashboardData?.averageScore ?? 0}%`,
      icon: <Trophy className="w-5 h-5 text-violet-400" />,
      subtext: "Average AI Score",
    },
    {
      label: "Interviews Taken",
      value: dashboardData?.interviewCount ?? 0,
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      subtext: "Completed Interviews",
    },
    {
      label: "Current Streak",
      value: "Coming Soon",
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      subtext: "Daily Practice",
    },
    {
      label: "Favorite Role",
      value: dashboardData?.user?.favoriteRole || "--",
      icon: <Building className="w-5 h-5 text-emerald-400" />,
      subtext: "Preferred Interview",
    },
  ];


  if (isPageLoading) {
  return <DashboardSkeleton />;
}
  
  return (

    <div className="w-full min-h-screen bg-black text-zinc-100 font-sans p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10 animate-fadeIn">

        {/* Header Segment */}
        <header className="space-y-1.5 border-b border-zinc-900 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
            Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">{userName} 👋</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            Telemetry pipelines synchronized. Your AI prep modules are optimized for active deployment.
          </p>
        </header>

        {/* 4-Column Performance KPI Stats Grid */}
        { }
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between h-36 transition hover:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="p-2 bg-black border border-zinc-900 rounded-xl">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-zinc-100 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] text-zinc-600 block font-mono">
                  {stat.subtext}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Two Column Layout: Quick Actions & Recent Sessions */}
        { }
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Column A: Quick Action Buttons (Span 2) */}
          <section className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Quick Actions
            </h3>

            <div className="flex flex-col gap-3">
              {/* Action: Start New Interview */}
              <button
                onClick={() => {
                  if (currentInterview) {
                    router.push(`/interviewsession?id=${currentInterview._id}`);
                  } else {
                    router.push("/interview");
                  }
                }}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold p-4 rounded-xl text-sm transition-all shadow-lg shadow-violet-950/20 hover:scale-[1.01] flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="block">
                      {currentInterview ? "Continue Interview" : "Start New Interview"}
                    </span>
                    <span className="text-[10px] text-violet-200 font-normal block mt-0.5">
                      {currentInterview
                        ? "Resume your unfinished interview"
                        : "Initialize simulator workspace"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Action: Interview History */}
              <button
                onClick={() => router.push("/history")}
                className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-200 font-semibold p-4 rounded-xl text-sm transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-black border border-zinc-900 p-2 rounded-lg text-zinc-400">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-zinc-200">Interview History</span>
                    <span className="text-[10px] text-zinc-500 font-normal block mt-0.5">Verify past records & performance</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Action: View Profile */}
              <button
                onClick={() => router.push("/profile")}
                className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-200 font-semibold p-4 rounded-xl text-sm transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-black border border-zinc-900 p-2 rounded-lg text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-zinc-200">View Profile</span>
                    <span className="text-[10px] text-zinc-500 font-normal block mt-0.5">Calibrate core setup metrics</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Column B: Recent Interviews Feed (Span 3) */}
          { }
          <section className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Recent Interviews
            </h3>

            <div className="space-y-3">
              {recentInterviews.length === 0 ? (
                <div className="text-zinc-500 text-sm text-center py-6">
                  No interviews completed yet.
                </div>
              ) : (
                recentInterviews.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex items-center justify-between transition hover:border-zinc-800"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-200">
                          {item.role}
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {item.difficulty}
                          </span>
                        </span>

                        {idx === 0 && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-violet-900/20 text-violet-400 border border-violet-500/10">
                            Latest Run
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-zinc-500 block">
                        Completed{" "}
                        {new Date(item.completedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-600 block uppercase font-mono tracking-wider">
                        AI SCORE
                      </span>

                      <span className={`text-lg font-black font-mono ${item.feedback?.score >= 80
                        ? "text-emerald-400"
                        : item.feedback?.score >= 60
                          ? "text-amber-400"
                          : "text-red-400"
                        }`}>
                        {item.feedback?.score ?? "--"}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}