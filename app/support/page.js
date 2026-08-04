"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Robot, Card, Label, fieldClass, labelClass } from "@/components/ui/Brand";

const FAQ = [
  { q: "Where can I see my past interviews?", a: "Head to the History tab — every completed session, score and report lives there." },
  { q: "How do I change my target role or skills?", a: "Open your Profile page to update target role, company and core tech stack anytime." },
  { q: "Can I download a report as PDF?", a: "Yes — open any completed interview's report and hit Download PDF." },
  { q: "Interview questions feel off-topic?", a: "Tell us the role/skills you set and what you expected — we tune the model from real feedback." },
];

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send message.");
        return;
      }

      setSuccess("Your message has been sent to the PrepAI team.");
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14">
        <div className="animate-rise">
          <div className="flex items-center gap-4 mb-[26px]">
            <Robot v="a" className="w-14 h-auto flex-none animate-bob" />
            <div>
              <div className="text-[11px] text-purple tracking-[.7px] uppercase mb-1.5">// prepai support</div>
              <h1 className="font-extrabold text-[24px] sm:text-[26px] tracking-[-.8px]">How can we help?</h1>
              <p className="text-[#8a8a97] text-[12.5px] mt-1">Have a question or facing an issue? Send a message to the PrepAI team.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-[22px]">
            <Card className="p-[22px] sm:p-[26px] h-fit">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className={labelClass}>SUBJECT</div>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Problem with interview feedback"
                    maxLength={120}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <div className={labelClass}>MESSAGE</div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question or issue…"
                    rows={7}
                    maxLength={1500}
                    className={`${fieldClass} resize-none`}
                  />
                  <p className="text-right text-[11px] text-[#6f6f7c] mt-2">{message.length}/1500</p>
                </div>

                {error && (
                  <div className="text-[13px] text-bad bg-bad/10 border border-bad/20 rounded-xl px-4 py-3">{error}</div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-[13px] text-good bg-good/10 border border-good/20 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 flex-none" /> {success}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending}
                    className="border-0 text-white font-semibold px-5 py-3 rounded-xl text-[13px] disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 10px 26px rgba(124,58,237,.36)" }}
                  >
                    {sending ? "Sending…" : "Send message →"}
                  </button>
                </div>
              </form>
            </Card>

            <div>
              <Label>// quick answers</Label>
              <Card className="p-[18px] mb-3.5">
                <div className="text-[11px] text-[#7a7a87] tracking-[.5px] uppercase mb-1">Typical response time</div>
                <div className="font-extrabold text-[20px] text-good">under 24 hours</div>
              </Card>
              {FAQ.map((item) => (
                <Card key={item.q} className="p-[16px] mb-2.5">
                  <div className="text-[12.5px] font-semibold text-[#e6e6ec] mb-1.5">{item.q}</div>
                  <div className="text-[11.5px] text-[#8a8a97] leading-[1.5]">{item.a}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
