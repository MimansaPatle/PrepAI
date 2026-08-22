"use client";

import { useEffect, useState } from "react";
import { PageHeader, ActionButton, Panel, StatTile, Tag, Avatar } from "@/components/AdminUI";

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
        <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14 animate-rise">
            <PageHeader
                eyebrow="admin / support"
                title="support tickets"
                description="review questions and issues submitted by PrepAI users."
                action={
                    <ActionButton onClick={handleRefresh} disabled={refreshing}>
                        {refreshing ? "syncing…" : "refresh"}
                    </ActionButton>
                }
            />

            <div className="grid grid-cols-3 gap-3.5 mb-8">
                <StatTile label="open" value={open} color="#ffb4ab" />
                <StatTile label="resolved" value={resolved} color="#34d399" />
                <StatTile label="total" value={messages.length} color="#e4e1e8" />
            </div>

            {loading ? (
                <div className="py-16 text-center text-[#6f6f7c] text-[13px]">loading messages…</div>
            ) : messages.length === 0 ? (
                <Panel className="p-12 text-center">
                    <p className="text-[#6f6f7c] text-[13px]">no support messages yet.</p>
                </Panel>
            ) : (
                <div className="space-y-3.5">
                    {messages.map((item) => (
                        <Panel key={item._id} className="p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex gap-3">
                                    <Avatar name={item.user?.name} />
                                    <div>
                                        <p className="font-semibold text-[13.5px] text-[#e4e1e8]">{item.user?.name || "Unknown user"}</p>
                                        <p className="text-[11px] text-[#6f6f7c]">{item.user?.email || "No email"}</p>
                                    </div>
                                </div>
                                <Tag tone={item.status === "resolved" ? "good" : "purple"}>{item.status === "resolved" ? "resolved" : "new"}</Tag>
                            </div>

                            <div className="mt-5">
                                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6f6f7c]">{"// subject"}</p>
                                <h2 className="text-[14px] font-semibold text-[#e4e1e8] mt-1.5">{item.subject}</h2>
                            </div>

                            <div className="mt-3.5 bg-[#0e0e12] border border-[#2a292e] p-4">
                                <p className="text-[12.5px] text-[#9090a0] leading-relaxed whitespace-pre-wrap">{item.message}</p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-[#494454] flex items-center justify-between gap-4">
                                <div className="text-[11px] text-[#6f6f7c]">
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                        : "—"}
                                </div>

                                {item.status === "new" ? (
                                    <button
                                        onClick={() => handleStatusChange(item._id, "resolved")}
                                        className="text-[11px] font-bold uppercase tracking-[.2em] text-[#34d399] px-3.5 py-2 border cursor-pointer hover:scale-[1.03] transition-transform duration-200"
                                        style={{ background: "rgba(52,211,153,.08)", borderColor: "rgba(52,211,153,.3)" }}
                                    >
                                        mark as resolved
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusChange(item._id, "new")}
                                        className="text-[11px] font-bold uppercase tracking-[.2em] text-[#958ea0] px-3.5 py-2 border border-[#494454] cursor-pointer hover:scale-[1.03] transition-transform duration-200"
                                    >
                                        reopen
                                    </button>
                                )}
                            </div>
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}
