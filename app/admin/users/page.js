"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PageHeader, ActionButton, Panel, StatTile, Avatar, searchFieldClass } from "@/components/AdminUI";

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
            <PageHeader
                eyebrow="admin / users"
                title="user management"
                description="view registered users and their interview activity."
                action={
                    <ActionButton onClick={handleRefresh} disabled={refreshing}>
                        {refreshing ? "syncing…" : "refresh"}
                    </ActionButton>
                }
            />

            <div className="grid grid-cols-3 gap-3.5 mb-6">
                <StatTile label="new this week" value={loading ? "…" : stats.newThisWeek} color="#d0bcff" />
                <StatTile label="active rate" value={loading ? "…" : `${stats.activeRate}%`} color="#34d399" />
                <StatTile label="avg readiness" value={loading ? "…" : `${stats.avgReadiness}%`} color="#a3c9ff" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="search by name, email or role…"
                    className={`${searchFieldClass} sm:max-w-md`}
                />
                <div className="text-[12px] text-[#8a8a97] uppercase tracking-[.2em]">
                    total users: <span className="text-[#e4e1e8] font-bold ml-1">{users.length}</span>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {[["all", "all"], ["active", "active"], ["new", "no interviews yet"]].map(([k, l]) => (
                    <button
                        key={k}
                        onClick={() => setFilter(k)}
                        className="text-[11px] font-bold uppercase tracking-[.2em] px-4 py-2 cursor-pointer border transition-colors duration-200"
                        style={filter === k ? { background: "rgba(208,188,255,.1)", borderColor: "rgba(208,188,255,.4)", color: "#d0bcff" } : { background: "transparent", borderColor: "#494454", color: "#958ea0" }}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <Panel className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#6f6f7c] text-[13px]">loading users…</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-[#6f6f7c] text-[13px]">no users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="border-b border-[#494454] text-[#6f6f7c] text-[10px] font-bold uppercase tracking-[.2em]">
                                    <th className="py-3.5 px-5 sm:px-6">user</th>
                                    <th className="py-3.5 px-5 sm:px-6">target role</th>
                                    <th className="py-3.5 px-5 sm:px-6">experience</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-center">interviews</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-center">completed</th>
                                    <th className="py-3.5 px-5 sm:px-6 text-right">avg score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
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
                                        <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.favoriteRole || "—"}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-[12px]">{user.experience || "—"}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-center">{user.totalInterviews}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-center">{user.completedInterviews}</td>
                                        <td className="py-3.5 px-5 sm:px-6 text-right font-display text-[13px] tracking-[.05em] text-[#d0bcff]">
                                            {user.completedInterviews > 0 ? `${user.averageScore}%` : "—"}
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
