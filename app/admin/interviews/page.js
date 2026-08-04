"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, fieldClass } from "@/components/ui/Brand";

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
            if (data.success) setInterviews(data.interviews);
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
        <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[22px]">
                <div>
                    <h1 className="font-extrabold text-[24px] sm:text-[26px] tracking-[-.8px]">Interview management</h1>
                    <p className="text-[#8a8a97] text-[12.5px] mt-1">Monitor interview sessions and AI evaluation results.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 border-0 text-white px-4 py-2.5 rounded-xl text-[12.5px] font-semibold disabled:opacity-60 self-start"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
                >
                    {refreshing ? "syncing…" : "refresh"}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-5">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search candidate, role, difficulty…"
                    className={`${fieldClass} sm:max-w-md`}
                />
                <div className="text-[12.5px] text-[#7a7a87]">
                    Total interviews: <span className="text-[#e6e6ec] font-semibold ml-1">{interviews.length}</span>
                </div>
            </div>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#7a7a87] text-[13px]">Loading interviews…</div>
                ) : filteredInterviews.length === 0 ? (
                    <div className="p-12 text-center text-[#7a7a87] text-[13px]">No interviews found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[820px]">
                            <thead>
                                <tr className="border-b border-white/[.07] text-[#7a7a87] text-[10px] uppercase tracking-[.5px] bg-field/60">
                                    <th className="py-3.5 px-5 sm:px-6">Candidate</th>
                                    <th className="py-3.5 px-5 sm:px-6">Role</th>
                                    <th className="py-3.5 px-5 sm:px-6">Difficulty</th>
                                    <th className="py-3.5 px-5 sm:px-6">Status</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">Score</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">Date</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[.05] text-[13px] text-[#c4c4cf]">
                                {filteredInterviews.map((interview) => (
                                    <tr key={interview.id}>
                                        <td className="py-3.5 px-5 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <span className="w-7 h-7 rounded-[9px] flex-none" style={{ background: "linear-gradient(135deg,#8b5cf6,#5b9be8)" }} />
                                                <div>
                                                    <div className="font-medium text-[#e6e6ec]">{interview.user?.name}</div>
                                                    <div className="text-[10.5px] text-[#6f6f7c]">{interview.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6 text-[12px]">{interview.role || "—"}</td>
                                        <td className="py-3.5 px-5 sm:px-6">
                                            <span className="text-[10.5px] px-2.5 py-1 rounded-full bg-field text-[#9090a0] uppercase tracking-[.4px]">{interview.difficulty || "—"}</span>
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6">
                                            <span
                                                className="text-[10.5px] px-2.5 py-1 rounded-full border"
                                                style={
                                                    interview.status === "completed"
                                                        ? { background: "rgba(52,211,153,.1)", color: "#34d399", borderColor: "rgba(52,211,153,.2)" }
                                                        : { background: "rgba(139,92,246,.12)", color: "#c4b5fd", borderColor: "rgba(139,92,246,.24)" }
                                                }
                                            >
                                                {interview.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6 text-right font-semibold text-purple-light">
                                            {interview.score !== null ? `${interview.score}%` : "—"}
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6 text-right text-[11px] text-[#6f6f7c]">
                                            {interview.createdAt
                                                ? new Date(interview.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                                : "—"}
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6 text-right">
                                            <button
                                                onClick={() => router.push(`/admin/interviews/${interview.id}`)}
                                                className="text-[11.5px] font-medium text-purple-light px-3 py-1.5 rounded-lg border border-purple/25"
                                                style={{ background: "rgba(139,92,246,.1)" }}
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
            </Card>
        </div>
    );
}
