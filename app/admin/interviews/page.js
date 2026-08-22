"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, ActionButton, Panel, Tag, Avatar, searchFieldClass } from "@/components/AdminUI";

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
            <PageHeader
                eyebrow="admin / interviews"
                title="interview management"
                description="monitor interview sessions and AI evaluation results."
                action={
                    <ActionButton onClick={handleRefresh} disabled={refreshing}>
                        {refreshing ? "syncing…" : "refresh"}
                    </ActionButton>
                }
            />

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="search candidate, role, difficulty…"
                    className={`${searchFieldClass} sm:max-w-md`}
                />
                <div className="text-[12px] text-[#8a8a97] uppercase tracking-[.2em]">
                    total interviews: <span className="text-[#e4e1e8] font-bold ml-1">{interviews.length}</span>
                </div>
            </div>

            <Panel className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#6f6f7c] text-[13px]">loading interviews…</div>
                ) : filteredInterviews.length === 0 ? (
                    <div className="p-12 text-center text-[#6f6f7c] text-[13px]">no interviews found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[820px]">
                            <thead>
                                <tr className="border-b border-[#494454] text-[#6f6f7c] text-[10px] font-bold uppercase tracking-[.2em]">
                                    <th className="py-3.5 px-5 sm:px-6">candidate</th>
                                    <th className="py-3.5 px-5 sm:px-6">role</th>
                                    <th className="py-3.5 px-5 sm:px-6">difficulty</th>
                                    <th className="py-3.5 px-5 sm:px-6">status</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">score</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">date</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInterviews.map((interview) => (
                                    <tr key={interview.id} className="border-b border-[#2a292e] last:border-0 text-[13px] text-[#cbc3d7]">
                                        <td className="py-3.5 px-5 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={interview.user?.name} />
                                                <div>
                                                    <div className="font-medium text-[#e4e1e8]">{interview.user?.name}</div>
                                                    <div className="text-[10.5px] text-[#6f6f7c]">{interview.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6 text-[12px]">{interview.role || "—"}</td>
                                        <td className="py-3.5 px-5 sm:px-6">
                                            <Tag>{interview.difficulty || "—"}</Tag>
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6">
                                            <Tag tone={interview.status === "completed" ? "good" : "purple"}>{interview.status}</Tag>
                                        </td>
                                        <td className="py-3.5 px-5 sm:px-6 text-right font-display text-[13px] tracking-[.05em] text-[#d0bcff]">
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
                                                className="text-[11px] font-bold uppercase tracking-[.2em] text-[#d0bcff] px-3 py-1.5 border cursor-pointer hover:scale-[1.03] transition-transform duration-200"
                                                style={{ background: "rgba(208,188,255,.08)", borderColor: "rgba(208,188,255,.3)" }}
                                            >
                                                view →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>
        </div>
    );
}
