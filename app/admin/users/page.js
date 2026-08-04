"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, fieldClass } from "@/components/ui/Brand";

function startOfWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
    return d;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (data.success) setUsers(data.users);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
    };

    const stats = useMemo(() => {
        const weekStart = startOfWeek(new Date());
        const newThisWeek = users.filter((u) => u.joinedAt && new Date(u.joinedAt) >= weekStart).length;
        const active = users.filter((u) => u.totalInterviews > 0).length;
        const activeRate = users.length ? Math.round((active / users.length) * 100) : 0;
        const withScores = users.filter((u) => u.completedInterviews > 0);
        const avgReadiness = withScores.length
            ? Math.round(withScores.reduce((a, u) => a + u.averageScore, 0) / withScores.length)
            : 0;
        return { newThisWeek, activeRate, avgReadiness };
    }, [users]);

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();
        const matchesSearch =
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            user.favoriteRole?.toLowerCase().includes(searchValue);

        if (!matchesSearch) return false;
        if (filter === "active") return user.totalInterviews > 0;
        if (filter === "new") return user.totalInterviews === 0;
        return true;
    });

    return (
        <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[22px]">
                <div>
                    <h1 className="font-extrabold text-[24px] sm:text-[26px] tracking-[-.8px]">User management</h1>
                    <p className="text-[#8a8a97] text-[12.5px] mt-1">View registered users and their interview activity.</p>
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

            <div className="grid grid-cols-3 gap-3.5 mb-5">
                <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">NEW THIS WEEK</div><div className="font-extrabold text-[23px] text-purple-light">{loading ? "…" : stats.newThisWeek}</div></Card>
                <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">ACTIVE RATE</div><div className="font-extrabold text-[23px] text-good">{loading ? "…" : `${stats.activeRate}%`}</div></Card>
                <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">AVG READINESS</div><div className="font-extrabold text-[23px] text-[#5b9be8]">{loading ? "…" : `${stats.avgReadiness}%`}</div></Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email or role…"
                    className={`${fieldClass} sm:max-w-md`}
                />
                <div className="text-[12.5px] text-[#7a7a87]">
                    Total users: <span className="text-[#e6e6ec] font-semibold ml-1">{users.length}</span>
                </div>
            </div>

            <div className="flex gap-1.5 mb-5">
                {[["all", "All"], ["active", "Active"], ["new", "No interviews yet"]].map(([k, l]) => (
                    <button
                        key={k}
                        onClick={() => setFilter(k)}
                        className="text-[12px] px-[15px] py-[7px] rounded-full cursor-pointer border"
                        style={filter === k ? { background: "rgba(139,92,246,.16)", borderColor: "rgba(139,92,246,.3)", color: "#c4b5fd" } : { background: "transparent", borderColor: "rgba(255,255,255,.1)", color: "#8a8a97" }}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#7a7a87] text-[13px]">Loading users…</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-[#7a7a87] text-[13px]">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="border-b border-white/[.07] text-[#7a7a87] text-[10px] uppercase tracking-[.5px] bg-field/60">
                                    <th className="py-3.5 px-5 sm:px-6">User</th>
                                    <th className="py-3.5 px-5 sm:px-6">Target role</th>
                                    <th className="py-3.5 px-5 sm:px-6">Experience</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-center">Interviews</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-center">Completed</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">Avg score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[.05] text-[13px] text-[#c4c4cf]">
                                {filteredUsers.map((user) => (
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
                                        <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.favoriteRole || "—"}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.experience || "—"}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-center">{user.totalInterviews}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-center">{user.completedInterviews}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-right font-semibold text-purple-light">
                                            {user.completedInterviews > 0 ? `${user.averageScore}%` : "—"}
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
