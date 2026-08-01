"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    IoDocumentTextOutline,
    IoSearchOutline,
    IoPersonCircleOutline,
    IoRefreshOutline,
} from "react-icons/io5";

export default function AdminInterviewsPage() {
    const router = useRouter();
    const [interviews, setInterviews] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadInterviews = async () => {
        try {
            const res = await fetch("/api/admin/interviews");

            const data = await res.json();

            if (data.success) {
                setInterviews(data.interviews);
            }
        } catch (error) {
            console.error("Failed to load interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInterviews();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);

        await loadInterviews();

        setRefreshing(false);
    };

    const filteredInterviews = interviews.filter((interview) => {
        const value = search.toLowerCase();

        return (
            interview.user?.name?.toLowerCase().includes(value) ||
            interview.user?.email?.toLowerCase().includes(value) ||
            interview.role?.toLowerCase().includes(value) ||
            interview.difficulty?.toLowerCase().includes(value) ||
            interview.status?.toLowerCase().includes(value)
        );
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 space-y-8">

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-6 gap-4">

                <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">
                        <IoDocumentTextOutline />
                        Interview Management
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight">
                        PrepAI Interviews
                    </h1>

                    <p className="text-zinc-400 text-sm mt-1">
                        Monitor interview sessions and AI evaluation results.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm transition"
                >
                    <IoRefreshOutline
                        className={refreshing ? "animate-spin" : ""}
                    />

                    {refreshing ? "Syncing..." : "Refresh"}
                </button>

            </header>

            {/* Search + Count */}
            <section className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

                <div className="relative w-full sm:max-w-md">

                    <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />

                    <input
                        type="text"
                        placeholder="Search candidate, role, difficulty..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition"
                    />

                </div>

                <div className="text-sm text-zinc-500">
                    Total Interviews:
                    <span className="text-zinc-200 font-semibold ml-2">
                        {interviews.length}
                    </span>
                </div>

            </section>

            {/* Table */}
            <section className="bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden">

                {loading ? (
                    <div className="p-12 text-center text-zinc-500">
                        Loading interviews...
                    </div>
                ) : filteredInterviews.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        No interviews found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wider bg-zinc-950/40">

                                    <th className="py-4 px-6">Candidate</th>
                                    <th className="py-4 px-6">Role</th>
                                    <th className="py-4 px-6">Difficulty</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Score</th>
                                    <th className="py-4 px-6 text-right">Date</th>
                                    <th className="py-4 px-6 text-right">Action</th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-900/60">

                                {filteredInterviews.map((interview) => (
                                    <tr
                                        key={interview.id}
                                        className="hover:bg-zinc-900/30 transition"
                                    >

                                        {/* Candidate */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">

                                                <IoPersonCircleOutline className="text-3xl text-zinc-600" />

                                                <div>
                                                    <p className="text-sm font-medium text-zinc-200">
                                                        {interview.user?.name}
                                                    </p>

                                                    <p className="text-[11px] text-zinc-500">
                                                        {interview.user?.email}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="py-4 px-6 text-sm text-zinc-400">
                                            {interview.role || "—"}
                                        </td>

                                        {/* Difficulty */}
                                        <td className="py-4 px-6">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                                                {interview.difficulty || "—"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-6">

                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full border ${interview.status === "completed"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    }`}
                                            >
                                                {interview.status}
                                            </span>

                                        </td>

                                        {/* Score */}
                                        <td className="py-4 px-6 text-right font-mono font-semibold">
                                            {interview.score !== null
                                                ? `${interview.score}%`
                                                : "—"}
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-6 text-right text-xs text-zinc-500">
                                            {interview.createdAt
                                                ? new Date(interview.createdAt).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )
                                                : "—"}
                                        </td>

                                        {/* Action */}
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() =>
                                                    router.push(`/admin/interviews/${interview.id}`)
                                                }
                                                className="text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 px-3 py-1.5 rounded-lg transition"
                                            >
                                                View →
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </div>
    );
}