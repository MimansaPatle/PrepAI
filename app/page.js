"use client";

import { useRouter } from "next/navigation";
import { Robot, Card, BrandMark } from "@/components/ui/Brand";

const FEATURES = [
  { n: "01", t: "AI simulation", d: "Role-specific, company-flavored questions across difficulty levels with a real timer.", tint: "rgba(139,92,246,.14)", dot: "#a78bfa" },
  { n: "02", t: "Deep feedback", d: "Every answer scored on technical depth, communication, confidence and problem-solving.", tint: "rgba(91,155,232,.14)", dot: "#5b9be8" },
  { n: "03", t: "Readiness score", d: "One placement prediction plus the exact gaps between you and the offer.", tint: "rgba(52,211,153,.12)", dot: "#34d399" },
  { n: "04", t: "Performance dash", d: "Track your score, favorite roles and full interview history in one place.", tint: "rgba(139,92,246,.14)", dot: "#a78bfa" },
  { n: "05", t: "PDF reports", d: "Export a polished, shareable report of any session for mentors or recruiters.", tint: "rgba(91,155,232,.14)", dot: "#5b9be8" },
  { n: "06", t: "Support & admin", d: "Platform analytics, user oversight and a built-in support desk.", tint: "rgba(52,211,153,.12)", dot: "#34d399" },
];

const HERO_STATS = [
  { v: "50K+", l: "mock interviews" },
  { v: "92%", l: "avg readiness" },
  { v: "40+", l: "roles & companies" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <nav className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark />
        </div>
        <div className="flex items-center gap-2">
          <a href="#features" className="text-[12px] text-[#7a7a87] tracking-[.5px] px-3 py-2 uppercase cursor-pointer">Features</a>
          <button onClick={() => router.push("/login")} className="bg-transparent border border-white/[.12] text-[#f2f2f5] px-4 py-2.5 rounded-[11px] text-[13px]">Sign in</button>
          <button
            onClick={() => router.push("/login")}
            className="border-0 text-white px-[18px] py-2.5 rounded-[11px] text-[13px] font-semibold"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 8px 22px rgba(124,58,237,.4)" }}
          >
            Start free →
          </button>
        </div>
      </nav>

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-11 pb-8 grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-5 items-center">
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-purple/35 rounded-full text-[11.5px] text-purple-lilac mb-6 uppercase tracking-[.6px]" style={{ background: "rgba(139,92,246,.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple animate-glowpulse" /> Adaptive AI interviewing
          </div>
          <h1 className="font-extrabold text-[40px] sm:text-[52px] leading-[1.08] mb-[22px] tracking-[-2px]">
            Practice the<br />interview. <span className="text-purple-light">Land</span><br />the offer.<span className="text-purple animate-caret">_</span>
          </h1>
          <p className="text-[15px] leading-[1.7] text-[#9090a0] max-w-[440px] mb-[30px]">
            Your pocket AI coach runs realistic, role-specific mock interviews, scores every answer, and hands you a precise roadmap to placement readiness.
          </p>
          <div className="flex flex-wrap gap-3 mb-[38px]">
            <button
              onClick={() => router.push("/login")}
              className="border-0 text-white px-7 py-[15px] rounded-[13px] text-[14.5px] font-semibold"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 12px 32px rgba(124,58,237,.42)" }}
            >
              Start free interview
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-white/[.04] border border-white/[.12] text-[#f2f2f5] px-6 py-[15px] rounded-[13px] text-[14.5px]"
            >
              Live demo
            </button>
          </div>
          <div className="grid grid-cols-3 gap-[34px] w-fit">
            {HERO_STATS.map((s) => (
              <div key={s.l}>
                <div className="font-extrabold text-2xl">{s.v}</div>
                <div className="text-[11px] text-[#6f6f7c] mt-1 uppercase tracking-[.5px]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[320px] lg:h-[460px] xl:h-[520px] flex items-center justify-center">
          <div className="absolute w-[330px] h-[330px] xl:w-[400px] xl:h-[400px] rounded-full animate-glowpulse" style={{ background: "radial-gradient(circle,rgba(139,92,246,.42),rgba(91,155,232,.14) 55%,transparent 68%)", filter: "blur(18px)" }} />
          <Robot v="b" className="w-[240px] sm:w-[340px] xl:w-[400px] h-auto relative z-[2] animate-floaty" />

          <Card className="hidden sm:block absolute top-[8%] right-[6%] lg:right-0 px-4 py-3 z-[3]">
            <div className="text-[9px] text-[#7a7a87] tracking-[.5px] uppercase mb-1">Readiness</div>
            <div className="font-extrabold text-[20px] text-good">92%</div>
          </Card>

          <Card className="hidden sm:block absolute bottom-[10%] left-[2%] lg:left-0 px-4 py-3 max-w-[190px] z-[3]">
            <div className="text-[12px] text-[#c4c4cf] leading-[1.5]">&ldquo;Nice structure — mention trade-offs next.&rdquo;</div>
          </Card>
        </div>
      </div>

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 px-[30px] py-[26px] border border-purple/20 rounded-[22px]" style={{ background: "linear-gradient(135deg,rgba(139,92,246,.1),rgba(91,155,232,.05))" }}>
          <Robot v="a" className="w-24 h-auto flex-none animate-bob" />
          <div>
            <div className="text-[11px] text-purple tracking-[.7px] uppercase mb-2">// meet your coach</div>
            <div className="text-[17px] leading-[1.5] text-[#e6e6ec]">Hi, I&apos;m your PrepAI interviewer. Tell me the role you&apos;re chasing and I&apos;ll grill you with the exact questions that company loves to ask — then break down every answer.</div>
          </div>
        </div>
      </div>

      <div id="features" className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-11">
        <div className="text-[11px] text-purple tracking-[.8px] uppercase mb-[18px]">// the complete prep suite</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <Card key={f.n} className="p-6">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="w-9 h-9 rounded-[11px] flex items-center justify-center text-[13px] font-extrabold" style={{ background: f.tint, color: f.dot }}>{f.n}</span>
                <span className="font-semibold text-[14.5px] tracking-[-.3px]">{f.t}</span>
              </div>
              <div className="text-[12.5px] leading-[1.65] text-[#8a8a97]">{f.d}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-11 pb-8">
        <div className="relative overflow-hidden border border-purple/[.24] rounded-[26px] px-6 sm:px-11 py-[52px] text-center" style={{ background: "radial-gradient(600px 260px at 50% 0,rgba(124,58,237,.22),transparent),#0c0b12" }}>
          <Robot v="b" className="hidden sm:block absolute -right-8 -bottom-11 w-[200px] h-auto opacity-90 animate-floaty" />
          <div className="relative">
            <h2 className="font-extrabold text-[28px] sm:text-[38px] mb-3.5 tracking-[-1.5px]">Your next interview is a<br />rehearsal away.</h2>
            <p className="text-[#9090a0] text-[14px] mx-auto mb-[26px] max-w-[440px]">Free to start. No card. Just you and your coach.</p>
            <button
              onClick={() => router.push("/login")}
              className="border-0 text-white px-[34px] py-[15px] rounded-[13px] text-[15px] font-semibold"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 14px 36px rgba(124,58,237,.44)" }}
            >
              Create free account
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-[26px] pt-[22px] border-t border-white/[.06] text-[#5c5c68] text-[11.5px] uppercase tracking-[.5px]">
          <span>© 2026 prepai — build your future</span>
          <span className="flex gap-5">
            <span>privacy</span>
            <span>terms</span>
            <button onClick={() => router.push("/support")} className="uppercase">support</button>
          </span>
        </div>
      </div>
    </div>
  );
}
