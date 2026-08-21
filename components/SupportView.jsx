"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, LifeBuoy } from "lucide-react";

const FAQ = [
  { q: "Where can I see my past interviews?", a: "Head to // PROGRESS — every completed session, score and report lives there." },
  { q: "How do I change my target role or skills?", a: "Open // SETTINGS to update target role, company and core tech stack anytime." },
  { q: "Can I download a report as PDF?", a: "Yes — open any completed interview's report and hit Download PDF." },
  { q: "Interview questions feel off-topic?", a: "Tell us the role/skills you set and what you expected — we tune the model from real feedback." },
];

const panelStyle = { background: "#1f1f24" };
const ctaStyle = { boxShadow: "0 0 20px 0 rgba(208,188,255,.2)" };
const fieldClass = "w-full bg-transparent border-0 border-b border-[#494454] focus:border-[#d0bcff] outline-none text-[#e4e1e8] text-[14px] px-0 py-3 placeholder:text-[#6f6f7c] transition-colors";

export default function SupportView() {
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
      setError("please enter both subject and message.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "failed to send message.");
        return;
      }

      setSuccess("your message has been sent to the prepai team.");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("something went wrong. please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-rise flex flex-col gap-8">
      <div className="border-b border-[#494454] pb-5">
        <h1
          className="font-display text-[26px] sm:text-[32px] text-[#e4e1e8] uppercase tracking-[.02em] mb-2"
          style={{ textShadow: "0 0 10px rgba(208,188,255,.5)" }}
        >
          {"support // help_desk"}
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#cbc3d7]">Have a question or facing an issue? Send a message to the PrepAI team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-6 items-start">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 border border-[#494454] flex flex-col gap-6" style={panelStyle}>
          <div>
            <label className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-3 block">{"// subject"}</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. problem with interview feedback"
              maxLength={120}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-3 block">{"// message"}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="describe your question or issue…"
              rows={7}
              maxLength={1500}
              className={`${fieldClass} resize-none`}
            />
            <p className="text-right text-[11px] text-[#6f6f7c] mt-2 font-display tracking-[.05em]">{`${message.length}/1500`}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 text-[13px] text-[#ffb4ab] border border-[#ffb4ab]/30 px-4 py-3" style={{ background: "rgba(255,180,171,.08)" }}>
              <AlertTriangle className="w-4 h-4 flex-none" /> {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 text-[13px] text-[#34d399] border border-[#34d399]/30 px-4 py-3" style={{ background: "rgba(52,211,153,.08)" }}>
              <CheckCircle2 className="w-4 h-4 flex-none" /> {success}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[#494454]">
            <button
              type="submit"
              disabled={sending}
              className="bg-[#d0bcff] text-[#3c0091] text-[12px] font-bold tracking-[.2em] uppercase py-3.5 px-7 hover:bg-[#e9ddff] transition-colors disabled:opacity-60 disabled:cursor-default cursor-pointer"
              style={ctaStyle}
            >
              {sending ? "transmitting…" : "transmit_message >>"}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-4 h-4 text-[#d0bcff]" />
            <span className="text-[12px] font-bold tracking-[.2em] text-[#d0bcff] uppercase">{"// quick_answers"}</span>
          </div>

          <div className="p-5 border border-[#494454]" style={panelStyle}>
            <div className="text-[11px] font-bold tracking-[.2em] text-[#958ea0] uppercase mb-3">{"// response_time"}</div>
            <div className="font-display text-[28px] text-[#34d399]" style={{ textShadow: "0 0 10px rgba(52,211,153,.5)" }}>{"< 24h"}</div>
          </div>

          {FAQ.map((item) => (
            <div key={item.q} className="p-5 border border-[#494454]" style={panelStyle}>
              <div className="text-[13.5px] font-bold text-[#e4e1e8] mb-2">{item.q}</div>
              <div className="text-[12.5px] text-[#958ea0] leading-[1.6]">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
