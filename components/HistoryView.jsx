"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoTimeOutline, IoChevronForward } from "react-icons/io5";
import HistorySkeleton from "./HistorySkeleton";

export default function HistoryView() {
  const router = useRouter();

  const [pastInterviews, setPastInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/interview/history");
        const data = await res.json();

        if (data.success) {
          setPastInterviews(data.interviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
  return <HistorySkeleton />;
}
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Session History 📚</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Review metrics, configurations, and AI analytics from your previous
          simulations.
        </p>
      </header>

      <div className="space-y-4">
        {pastInterviews.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            No completed interviews yet.
          </div>
        ) : (

          pastInterviews.map((session, index) => (
            <div
              key={session._id}
              className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/50 text-zinc-400 group-hover:text-violet-400 transition">
                  <IoTimeOutline className="text-xl" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-100">
                      {session.role}
                    </h3>

                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-zinc-700">
                      {session.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 mt-1">
                    Completed on{" "}
                    {new Date(session.completedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 border-zinc-800 pt-3 sm:pt-0">
                <div className="text-right">
                  <span className="text-xs text-zinc-500 block uppercase font-mono">
                    Performance
                  </span>

                  <span
                    className={`text-lg font-bold ${session.feedback?.score >= 80
                      ? "text-emerald-400"
                      : "text-amber-400"
                      }`}
                  >
                    {session.feedback?.score ?? "--"}%
                  </span>
                </div>

                <button
                  onClick={() =>
                    router.push(`/feedback?id=${session._id}`)
                  }
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-xl border border-zinc-700/60 transition text-sm flex items-center gap-1"
                >
                  Review Metrics <IoChevronForward />
                </button>
              </div>
            </div>
          ))

        )}
      </div>
    </div>
  );
}