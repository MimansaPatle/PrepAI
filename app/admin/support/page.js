"use client";

import { useEffect, useState } from "react";
import {
    IoChatbubbleEllipsesOutline,
    IoRefreshOutline,
    IoPersonCircleOutline,
    IoTimeOutline,
} from "react-icons/io5";

export default function AdminSupportPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadMessages = async () => {
        try {
            const res = await fetch("/api/admin/support");
            const data = await res.json();

            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Failed to load support messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadMessages();
        setRefreshing(false);
    };

    const handleStatusChange = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/support/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error(data.message);
                return;
            }

            // Update UI immediately
            setMessages((prev) =>
                prev.map((message) =>
                    message._id === id
                        ? { ...message, status }
                        : message
                )
            );

        } catch (error) {
            console.error("Failed to update support message:", error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">
                            <IoChatbubbleEllipsesOutline />
                            Support Center
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight">
                            User Messages
                        </h1>

                        <p className="text-zinc-400 text-sm mt-1">
                            Review questions and issues submitted by PrepAI users.
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

                {/* Count */}
                <div className="text-sm text-zinc-500">
                    Total Messages:
                    <span className="ml-2 text-zinc-200 font-semibold">
                        {messages.length}
                    </span>
                </div>

                {/* Messages */}
                {loading ? (
                    <div className="py-16 text-center text-zinc-500">
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="border border-zinc-800 rounded-2xl p-12 text-center">
                        <IoChatbubbleEllipsesOutline className="text-4xl text-zinc-700 mx-auto mb-3" />

                        <p className="text-zinc-400">
                            No support messages yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((item) => (
                            <div
                                key={item._id}
                                className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6"
                            >
                                {/* Top */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                                    <div className="flex gap-3">
                                        <IoPersonCircleOutline className="text-3xl text-zinc-600 shrink-0" />

                                        <div>
                                            <p className="font-semibold text-zinc-200">
                                                {item.user?.name || "Unknown User"}
                                            </p>

                                            <p className="text-xs text-zinc-500">
                                                {item.user?.email || "No email"}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`self-start text-xs px-2.5 py-1 rounded-full border ${item.status === "resolved"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            }`}
                                    >
                                        {item.status === "resolved" ? "Resolved" : "New"}
                                    </span>
                                </div>

                                {/* Subject */}
                                <div className="mt-5">
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                        Subject
                                    </p>

                                    <h2 className="text-base font-semibold text-zinc-200 mt-1">
                                        {item.subject}
                                    </h2>
                                </div>

                                {/* Message */}
                                <div className="mt-4 bg-black border border-zinc-900 rounded-xl p-4">
                                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                        {item.message}
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-4">

                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                        <IoTimeOutline />

                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "—"}
                                    </div>

                                    {/* Status Action */}
                                    {item.status === "new" ? (
                                        <button
                                            onClick={() =>
                                                handleStatusChange(item._id, "resolved")
                                            }
                                            className="text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-3 py-2 rounded-lg transition"
                                        >
                                            Mark as Resolved
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleStatusChange(item._id, "new")
                                            }
                                            className="text-xs font-medium text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg transition"
                                        >
                                            Reopen
                                        </button>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}