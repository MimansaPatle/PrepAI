"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Brand";

export default function AdminSupportPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadMessages = async () => {
        try {
            const res = await fetch("/api/admin/support");
            const data = await res.json();
            if (data.success) setMessages(data.messages);
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error(data.message);
                return;
            }

            setMessages((prev) => prev.map((message) => (message._id === id ? { ...message, status } : message)));
        } catch (error) {
            console.error("Failed to update support message:", error);
        }
    };

    const open = messages.filter((m) => m.status !== "resolved").length;
    const resolved = messages.filter((m) => m.status === "resolved").length;

    return (
        <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise space-y-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-[24px] sm:text-[26px] tracking-[-.8px]">Support tickets</h1>
                    <p className="text-[#8a8a97] text-[12.5px] mt-1">Review questions and issues submitted by PrepAI users.</p>
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

            <div className="grid grid-cols-3 gap-3.5">
                <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">OPEN</div><div className="font-extrabold text-[23px] text-bad">{open}</div></Card>
                <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">RESOLVED</div><div className="font-extrabold text-[23px] text-good">{resolved}</div></Card>
                <Card className="p-[18px]"><div className="text-[10px] text-[#7a7a87] tracking-[.6px] mb-2.5">TOTAL</div><div className="font-extrabold text-[23px]">{messages.length}</div></Card>
            </div>

            {loading ? (
                <div className="py-16 text-center text-[#7a7a87] text-[13px]">Loading messages…</div>
            ) : messages.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-[#8a8a97] text-[13px]">No support messages yet.</p>
                </Card>
            ) : (
                <div className="space-y-3.5">
                    {messages.map((item) => (
                        <Card key={item._id} className="p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex gap-3">
                                    <span className="w-9 h-9 rounded-[10px] flex-none" style={{ background: "linear-gradient(135deg,#8b5cf6,#5b9be8)" }} />
                                    <div>
                                        <p className="font-semibold text-[13.5px] text-[#e6e6ec]">{item.user?.name || "Unknown user"}</p>
                                        <p className="text-[11px] text-[#7a7a87]">{item.user?.email || "No email"}</p>
                                    </div>
                                </div>
                                <span
                                    className="self-start text-[10.5px] px-2.5 py-1 rounded-full border"
                                    style={
                                        item.status === "resolved"
                                            ? { background: "rgba(52,211,153,.1)", color: "#34d399", borderColor: "rgba(52,211,153,.2)" }
                                            : { background: "rgba(139,92,246,.12)", color: "#c4b5fd", borderColor: "rgba(139,92,246,.24)" }
                                    }
                                >
                                    {item.status === "resolved" ? "resolved" : "new"}
                                </span>
                            </div>

                            <div className="mt-5">
                                <p className="text-[10px] uppercase tracking-[.4px] text-[#6f6f7c]">subject</p>
                                <h2 className="text-[14px] font-semibold text-[#e6e6ec] mt-1">{item.subject}</h2>
                            </div>

                            <div className="mt-3.5 bg-field border border-white/[.06] rounded-xl p-4">
                                <p className="text-[12.5px] text-[#9090a0] leading-relaxed whitespace-pre-wrap">{item.message}</p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-white/[.07] flex items-center justify-between gap-4">
                                <div className="text-[11px] text-[#6f6f7c]">
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                        : "—"}
                                </div>

                                {item.status === "new" ? (
                                    <button
                                        onClick={() => handleStatusChange(item._id, "resolved")}
                                        className="text-[11.5px] font-medium text-good px-3 py-2 rounded-lg border border-good/25"
                                        style={{ background: "rgba(52,211,153,.1)" }}
                                    >
                                        Mark as resolved
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusChange(item._id, "new")}
                                        className="text-[11.5px] font-medium text-[#9090a0] px-3 py-2 rounded-lg border border-white/[.1] bg-field"
                                    >
                                        Reopen
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
