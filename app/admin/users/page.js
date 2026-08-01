"use client";

import React, { useEffect, useState } from "react";
import {
    IoPeopleOutline,
    IoSearchOutline,
    IoPersonCircleOutline,
    IoArrowBackOutline,
    IoRefreshOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch users from admin API
    const loadUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");

            const data = await res.json();

            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Refresh button
    const handleRefresh = async () => {
        setRefreshing(true);

        await loadUsers();

        setRefreshing(false);
    };

    // Search users
    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            user.favoriteRole?.toLowerCase().includes(searchValue)
        );
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 space-y-8">

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-6 gap-4">

                <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">
                        <IoPeopleOutline />
                        User Management
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight">
                        PrepAI Users
                    </h1>

                    <p className="text-zinc-400 text-sm mt-1">
                        View registered users and their interview activity.
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => router.push("/admin")}
                        className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-sm transition"
                    >
                        <IoArrowBackOutline />
                        Dashboard
                    </button>

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

                </div>
            </header>

            {/* Search + User Count */}
            <section className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

                <div className="relative w-full sm:max-w-md">

                    <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />

                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition"
                    />

                </div>

                <div className="text-sm text-zinc-500">
                    Total Users:
                    <span className="text-zinc-200 font-semibold ml-2">
                        {users.length}
                    </span>
                </div>

            </section>

            {/* Users Table */}
            <section className="bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden">

                {loading ? (
                    <div className="p-12 text-center text-zinc-500">
                        Loading users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wider bg-zinc-950/40">

                                    <th className="py-4 px-6">
                                        User
                                    </th>

                                    <th className="py-4 px-6">
                                        Target Role
                                    </th>

                                    <th className="py-4 px-6">
                                        Experience
                                    </th>

                                    <th className="py-4 px-6 text-center">
                                        Interviews
                                    </th>

                                    <th className="py-4 px-6 text-center">
                                        Completed
                                    </th>

                                    <th className="py-4 px-6 text-right">
                                        Avg Score
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-900/60">

                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-zinc-900/30 transition"
                                    >

                                        {/* User */}
                                        <td className="py-4 px-6">

                                            <div className="flex items-center gap-3">

                                                <IoPersonCircleOutline className="text-3xl text-zinc-600" />

                                                <div>
                                                    <p className="text-sm font-medium text-zinc-200">
                                                        {user.name}
                                                    </p>

                                                    <p className="text-[11px] text-zinc-500">
                                                        {user.email}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        {/* Role */}
                                        <td className="py-4 px-6 text-sm text-zinc-400">
                                            {user.favoriteRole || "—"}
                                        </td>

                                        {/* Experience */}
                                        <td className="py-4 px-6 text-sm text-zinc-400">
                                            {user.experience || "—"}
                                        </td>

                                        {/* Interviews */}
                                        <td className="py-4 px-6 text-center font-mono">
                                            {user.totalInterviews}
                                        </td>

                                        {/* Completed */}
                                        <td className="py-4 px-6 text-center font-mono">
                                            {user.completedInterviews}
                                        </td>

                                        {/* Score */}
                                        <td className="py-4 px-6 text-right font-semibold font-mono">

                                            {user.completedInterviews > 0
                                                ? `${user.averageScore}%`
                                                : "—"}

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