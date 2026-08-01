"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  IoHelpCircleOutline,
  IoSendOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!subject.trim() || !message.trim()) {
      setError("Please enter both subject and message.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send message.");
        return;
      }

      setSuccess("Your message has been sent to the PrepAI team.");

      // Clear form
      setSubject("");
      setMessage("");

    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase tracking-[0.2em] mb-3">
            <IoHelpCircleOutline className="text-lg" />
            PrepAI Support
          </div>

          <h1 className="text-3xl font-bold">
            How can we help?
          </h1>

          <p className="text-zinc-500 mt-2 text-sm">
            Have a question or facing an issue? Send a message to the
            PrepAI team.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-zinc-800 bg-zinc-950/50 rounded-2xl p-7 space-y-6"
        >

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Problem with interview feedback"
              maxLength={120}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or issue..."
              rows={7}
              maxLength={1500}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500 transition resize-none"
            />

            <p className="text-right text-[11px] text-zinc-600 mt-2">
              {message.length}/1500
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
              <IoCheckmarkCircleOutline className="text-lg" />
              {success}
            </div>
          )}

          {/* Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl text-sm transition"
            >
              <IoSendOutline />

              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}