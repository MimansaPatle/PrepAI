"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import CountUp from "react-countup";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ui/ScrollReveal";

const STATS = [
  { num: 50, suffix: "+", label: "role tracks" },
  { num: 92, suffix: "%", label: "full mock ready" },
  { num: 2, suffix: "m", label: "avg. response time" },
  { num: 1, suffix: "m+", label: "answers scored" },
];

const STEPS = [
  { n: "01", t: "pick a role", d: "50+ tracks, from frontend to backend." },
  { n: "02", t: "type your answer", d: "a focused composer, one question at a time." },
  { n: "03", t: "get scored", d: "content, structure & clarity, per answer." },
  { n: "04", t: "fix & repeat", d: "targeted drills on your weak spots." },
];

function SegmentedBar({ label, value, color }) {
  const total = 24;
  const active = Math.round((value / 100) * total);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9.5px] uppercase tracking-[.5px] text-[#6f6f7c]">{label}</span>
        <span className="font-display text-[13px]" style={{ color }}>{value}</span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="h-[9px] flex-1 rounded-[1px]"
            style={{ background: i < active ? color : "rgba(255,255,255,.08)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const navRef = useRef(null);
  const navLogoRef = useRef(null);
  const introRef = useRef(null);
  const stageRef = useRef(null);
  const heroRef = useRef(null);
  const ghostRef = useRef(null);
  const scrollCueRef = useRef(null);
  const bgRef = useRef(null);
  const welcomeRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Logo intro: a dedicated pinned scroll-stage, not a plain fixed overlay
  // sitting on top of a normally-scrolling page. `introRef` is a tall spacer
  // (200vh); `stageRef` inside it is `position: sticky`, so it stays glued
  // to the viewport for exactly as long as the spacer has extra height to
  // give up. Progress `p` is derived directly from how much of that spacer
  // has scrolled past — not from an arbitrary pixel constant — so the logo
  // moves on literally the first pixel of scroll and is still moving on the
  // last one, in lockstep with the hero reveal that lives inside the same
  // stage. Nothing below (stats/steps/testimonial/cta) can scroll into view
  // until this stage releases, so there's no way for the two animations to
  // drift apart or for the logo to "run out" of scroll before finishing.
  useEffect(() => {
    const intro = introRef.current;
    const stage = stageRef.current;
    const hero = heroRef.current;
    const ghost = ghostRef.current;
    const navEl = navRef.current;
    const navLogo = navLogoRef.current;
    const cue = scrollCueRef.current;
    const bg = bgRef.current;
    const welcome = welcomeRef.current;
    if (!intro || !stage || !hero || !ghost || !navEl || !navLogo || !cue || !bg || !welcome) return;

    // The ghost's resting spot (viewport dead-center, see below) is only
    // empty space on the 2-column desktop hero grid — below `lg` (1024px)
    // that grid collapses to a single stacked column (`grid-cols-1
    // lg:grid-cols-[...]` on the hero below), so viewport-center lands
    // directly on the badge/heading text instead. There's no "empty slot"
    // to fly between on that layout, so skip the pinned flight entirely
    // and fall back to the same static/final-state render used for
    // prefers-reduced-motion.
    const isStackedLayout = window.matchMedia("(max-width: 1023px)").matches;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isStackedLayout) {
      intro.style.height = "auto";
      stage.style.position = "static";
      stage.style.height = "auto";
      hero.style.opacity = "1";
      hero.style.transform = "none";
      ghost.style.display = "none";
      navLogo.style.opacity = "1";
      cue.style.display = "none";
      welcome.style.display = "none";
      bg.style.filter = "none";
      return;
    }

    const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);
    const lerp = (a, b, t) => a + (b - a) * t;

    // The ghost's native size (for the scale ratio) and the stage's `top`
    // offset (it sticks right below the navbar) — both re-measured on
    // mount/resize, never cached mid-scroll, so a stray resize (devtools,
    // mobile address-bar) can't corrupt an already-in-flight animation.
    // Deliberately no explicit stage height: it sizes to its own content
    // (the hero grid) instead of being forced to fill the full viewport —
    // forcing 100dvh left a few hundred px of empty box below the (shorter)
    // hero content, which then showed up as dead space to scroll past once
    // the pin released.
    let restW = 1;
    const measure = () => {
      restW = ghost.getBoundingClientRect().width || 1;
      const navH = navEl.getBoundingClientRect().height;
      stage.style.top = `${navH}px`;
    };

    const render = () => {
      const rect = intro.getBoundingClientRect();
      const scrollable = Math.max(intro.offsetHeight - window.innerHeight, 1);
      const p = clamp01(-rect.top / scrollable);

      // Hero settles in slightly ahead of the logo landing (finishes at 60%
      // of the stage instead of 100%) so the two don't resolve in the exact
      // same instant — but both start moving from p=0, at the same time as
      // the logo, not after it.
      const heroP = clamp01(p / 0.6);
      hero.style.opacity = String(heroP);
      hero.style.transform = `translateY(${(1 - heroP) * 22}px)`;

      // The "keep scrolling" hint and welcome caption only matter before
      // the user has started — gone well before the logo itself starts
      // noticeably moving, not lingering through the whole transition.
      const introTextOpacity = String(clamp01(1 - p / 0.22));
      cue.style.opacity = introTextOpacity;
      welcome.style.opacity = introTextOpacity;

      // Resting position MUST match what the ghost's own CSS (`top-1/2
      // left-1/2`) actually resolves to, or the mismatch doesn't cancel
      // out — it's baked into every frame of the bezier, including the
      // endpoint, landing the logo next to the navbar slot instead of on
      // it. Vertically that's a clean `window.innerHeight / 2` (nothing
      // horizontal touches height). Horizontally, `window.innerWidth`
      // measured ~5px wider than where things actually render — a
      // reserved scrollbar gutter that the fixed-position containing
      // block excludes but `innerWidth` doesn't. `navEl`'s own rendered
      // width is ground truth for "how wide the usable viewport actually
      // is" (it's a full-bleed block, always flush left at x:0), so
      // anchoring to that instead sidesteps the innerWidth/clientWidth
      // ambiguity entirely.
      const navElRect = navEl.getBoundingClientRect();
      const restCX = navElRect.left + navElRect.width / 2;
      const restCY = window.innerHeight / 2;

      const navRect = navLogo.getBoundingClientRect();
      const targetCX = navRect.left + navRect.width / 2;
      const targetCY = navRect.top + navRect.height / 2;
      const targetScale = navRect.width / restW;

      // Slight arc via a raised midpoint control point, so the mark curves
      // toward the navbar instead of sliding in a straight diagonal line.
      const dx = targetCX - restCX;
      const dy = targetCY - restCY;
      const midX = restCX + dx * 0.5;
      const midY = restCY + dy * 0.5 - Math.max(60, Math.abs(dy) * 0.3);
      const inv = 1 - p;
      const curveX = inv * inv * restCX + 2 * inv * p * midX + p * p * targetCX;
      const curveY = inv * inv * restCY + 2 * inv * p * midY + p * p * targetCY;

      const scale = lerp(1, targetScale, p);
      ghost.style.transform = `translate3d(calc(-50% + ${curveX - restCX}px), calc(-50% + ${curveY - restCY}px), 0) scale(${scale})`;
      ghost.style.borderRadius = `${7 / scale}px`;

      // The logo itself stays crisp the entire time — it's the BACKDROP
      // that defocuses under it (matching the reference), not the mark
      // being carried into the navbar. Zero blur at p=0 (full visibility
      // at rest) and zero again by p=0.9+ (clear well before landing);
      // peaks around the midpoint. Purely a function of live scroll
      // position recomputed every frame, so scrolling back up runs this
      // exact curve in reverse — full clarity returns as p drops back
      // toward 0, no separate "reverse" logic needed.
      const bgBlurPx = 10 * Math.sin(Math.PI * clamp01(p / 0.9));
      bg.style.filter = bgBlurPx > 0.05 ? `blur(${bgBlurPx}px)` : "none";

      // Hand-off right at the very end of the pin range — the real navbar
      // logo is already sitting there at full size, this is just a
      // same-position, same-size crossfade.
      const handoff = clamp01((p - 0.92) / 0.08);
      ghost.style.opacity = String(1 - handoff);
      navLogo.style.opacity = String(handoff);

      return p;
    };

    // Driven by a continuous rAF loop reading live rects directly, not a
    // "scroll" event listener — it just reads the current truth every
    // frame, for as long as the intro is running.
    let rafId = null;
    let done = false;
    const onResize = () => measure();

    const loop = () => {
      const p = render();
      done = p <= 0 || p >= 1;
      if (!done) rafId = requestAnimationFrame(loop);
      else rafId = null;
    };
    // Pick the loop back up whenever scroll direction changes at either end.
    const onScroll = () => {
      if (done) {
        done = false;
        rafId = requestAnimationFrame(loop);
      }
    };

    measure();
    rafId = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "#0e0e12" }}>
      {/* Wrapped in its own `fixed inset-0` box (rather than blurring these
          two layers directly) so the `filter` driven by the scroll effect
          has an explicitly-sized element to apply to — a `filter` on an
          ancestor becomes the containing block for `position: fixed`
          descendants, which would otherwise yank these two out of normal
          fixed-to-viewport behavior the moment blur turns on. */}
      <div ref={bgRef} className="fixed inset-0 pointer-events-none">
        <div className="dot-grid-terminal absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 84% -8%, rgba(208,188,255,.10), transparent 58%), radial-gradient(760px 520px at 4% 106%, rgba(163,201,255,.08), transparent 55%)",
          }}
        />
      </div>

      <nav
        ref={navRef}
        className="relative sticky top-0 z-40 backdrop-blur-md transition-[background-color,border-color] duration-300"
        style={{
          background: scrolled ? "rgba(14,14,18,.88)" : "rgba(14,14,18,.55)",
          borderBottom: `1px solid rgba(255,255,255,${scrolled ? 0.08 : 0.04})`,
        }}
      >
        <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span ref={navLogoRef} className="w-7 h-7 rounded-[7px] flex-none" style={{ opacity: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PrepAI" className="w-full h-full object-contain" />
            </span>
            <span className="font-display text-[15px] tracking-[.5px] text-[#e4e1e8]">prepai</span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <a href="#how-it-works" className="px-3.5 py-2 text-[11px] uppercase tracking-[.6px] text-[#958ea0] hover:text-[#e4e1e8] transition-colors duration-200">product</a>
            <a href="#proof" className="px-3.5 py-2 text-[11px] uppercase tracking-[.6px] text-[#958ea0] hover:text-[#e4e1e8] transition-colors duration-200">models</a>
            <a href="#cta" className="px-3.5 py-2 text-[11px] uppercase tracking-[.6px] text-[#958ea0] hover:text-[#e4e1e8] transition-colors duration-200">pricing</a>
            <button onClick={() => router.push("/login")} className="px-3.5 py-2 text-[11px] uppercase tracking-[.6px] text-[#958ea0] hover:text-[#e4e1e8] transition-colors duration-200 cursor-pointer">log in</button>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="text-[11px] uppercase tracking-[.6px] px-5 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-[1.04] hover:brightness-110"
            style={{ background: "#d0bcff", color: "#3c0091", boxShadow: "0 0 24px rgba(208,188,255,.3)" }}
          >
            start free &gt;&gt;
          </button>
        </div>
      </nav>

      {/* INTRO / HERO TRANSITION STAGE — dedicated pinned scroll section (see
          the effect above). `introRef` reserves 200vh of real scroll room;
          `stageRef` pins to the viewport (right below the navbar) for that
          entire range, so nothing below it can scroll into view until the
          logo has finished travelling into the navbar and the hero has
          fully revealed. Both animate off the exact same progress value. */}
      <div ref={introRef} className="relative" style={{ height: "200vh" }}>
        <div ref={stageRef} className="sticky overflow-hidden" style={{ top: 0 }}>
          {/* Sits just below the ghost logo's resting center. `position:
              fixed` like the ghost itself (not absolute within the stage),
              so it's anchored to the same viewport-relative math instead of
              drifting if the stage's own box ever shifts. */}
          <div
            ref={welcomeRef}
            className="fixed left-1/2 z-[94] -translate-x-1/2 text-center pointer-events-none motion-reduce:hidden top-[calc(50%+103px)] sm:top-[calc(50%+128px)] md:top-[calc(50%+148px)]"
          >
            <span className="font-display text-[16px] sm:text-[19px] tracking-[1px] text-[#e4e1e8]">
              welcome to prepai.
            </span>
          </div>
          {/* `fixed` + viewport-center math like the ghost/welcome text —
              not `absolute bottom-10` within the stage — because the stage
              no longer has a fixed 100dvh height to anchor "bottom" to; it
              now sizes to the hero content, which would put an absolutely-
              positioned "bottom" right on top of the hero instead of below
              the logo where it belongs. */}
          <div
            ref={scrollCueRef}
            className="fixed left-1/2 z-[94] -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none motion-reduce:hidden animate-bob top-[calc(50%+165px)] sm:top-[calc(50%+190px)] md:top-[calc(50%+210px)]"
          >
            <span className="text-[10px] uppercase tracking-[3px] text-[#6f6f7c]">scroll</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#6f6f7c]">
              <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            ref={heroRef}
            className="relative z-10 w-full py-16 sm:py-20 px-5 sm:px-8 lg:px-14 xl:px-20 grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-10 items-center"
            style={{ opacity: 0, transform: "translateY(22px)" }}
          >
        <div>
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#d0bcff]/30 rounded-full text-[11px] text-[#cbc3d7] mb-7 uppercase tracking-[.5px]"
            style={{ background: "rgba(208,188,255,.06)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-glowpulse" />
            // ai mock-interview coach
          </div>
          <h1 className="font-display text-[38px] sm:text-[52px] leading-[1.16] mb-6 text-[#e4e1e8]">
            ace it before you<br />
            <span
              className="italic"
              style={{ background: "linear-gradient(90deg,#d0bcff,#a3c9ff)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
            >
              walk in.
            </span>
          </h1>
          <p className="text-[14.5px] leading-[1.75] text-[#958ea0] max-w-[440px] mb-8">
            prepai runs interviews that feel real — you type your answers. it scores content, structure and clarity, and hands you the exact fix. one question at a time.
          </p>
          <div className="flex flex-wrap gap-3 mb-9">
            <button
              onClick={() => router.push("/login")}
              className="text-[13.5px] uppercase tracking-[.4px] font-semibold px-6 py-3.5 rounded-[10px] transition-all duration-200 hover:scale-[1.03] hover:brightness-110"
              style={{ background: "#d0bcff", color: "#3c0091", boxShadow: "0 12px 30px rgba(208,188,255,.26)" }}
            >
              start free interview &gt;&gt;
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-[13.5px] px-6 py-3.5 rounded-[10px] border border-white/[.12] text-[#e4e1e8] transition-all duration-200 hover:scale-[1.03] hover:border-white/[.28] hover:bg-white/[.04]"
            >
              <Play className="w-3 h-3" fill="currentColor" /> watch demo
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full border-2" style={{ borderColor: "#0e0e12", background: "linear-gradient(135deg,#d0bcff,#a3c9ff)" }} />
              <span className="w-6 h-6 rounded-full border-2" style={{ borderColor: "#0e0e12", background: "linear-gradient(135deg,#a3c9ff,#d0bcff)" }} />
            </div>
            <span className="text-[11.5px] text-[#6f6f7c] uppercase tracking-[.4px]">
              <CountUp end={60485} separator="," duration={1.6} />+ answers scored this week
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 rounded-[26px] opacity-70 pointer-events-none"
            style={{ background: "radial-gradient(420px 300px at 60% 30%, rgba(163,201,255,.14), transparent 65%)", filter: "blur(6px)" }}
          />
          <div className="relative rounded-2xl border border-white/[.08] overflow-hidden" style={{ background: "#131317" }}>
            <div className="dot-grid absolute inset-0 opacity-[0.1] pointer-events-none" />
            <div className="relative px-5 py-4 flex items-center justify-between border-b border-white/[.06]">
              <span className="flex items-center gap-2 text-[10.5px] uppercase tracking-[.6px] text-[#958ea0]">
                <span className="w-1.5 h-1.5 rounded-full animate-glowpulse" style={{ background: "#34d399" }} /> live &middot; prompted interview
              </span>
              <span className="font-display text-[13px] text-[#a3c9ff]">04/10</span>
            </div>
            <div className="relative px-5 pt-5">
              <p className="text-[15px] italic text-[#e4e1e8] leading-[1.6] mb-5">
                &ldquo;tell me about a time you disagreed with a teammate.&rdquo;
              </p>
              <div className="rounded-[10px] border border-white/[.08] p-4 mb-4" style={{ background: "#0e0e12" }}>
                <div className="text-[9.5px] uppercase tracking-[.5px] text-[#6f6f7c] mb-2.5">// your typed answer</div>
                <p className="text-[12.5px] leading-[1.7] text-[#cbc3d7]">
                  during a sprint i pushed back on shipping without tests. i paired with the lead, we agreed on a quick coverage plan
                  <span className="inline-block w-[7px] h-[13px] bg-[#a3c9ff] align-middle ml-0.5 animate-blockcaret" />
                </p>
              </div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10.5px] text-[#6f6f7c] tracking-[.3px]">kb.state &middot; 34s</span>
                <button className="text-[10.5px] uppercase tracking-[.5px] px-3.5 py-2 rounded-md font-semibold transition-all duration-200 hover:scale-[1.05] hover:brightness-110" style={{ background: "#a3c9ff", color: "#00315c" }}>
                  submit
                </button>
              </div>
            </div>
            <div className="relative px-5 pb-5 space-y-3.5">
              <SegmentedBar label="structure" value={86} color="#a3c9ff" />
              <SegmentedBar label="clarity" value={74} color="#d0bcff" />
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      <section id="proof" className="relative w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-8">
        <ScrollReveal className="rounded-2xl border border-white/[.08] overflow-hidden grid grid-cols-2 sm:grid-cols-4" style={{ background: "#131317" }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-8 text-center border-white/[.08] ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : "border-b-0"} sm:border-b-0 ${i < STATS.length - 1 ? "sm:border-r" : "sm:border-r-0"}`}
            >
              <div className="font-display text-[28px] sm:text-[30px] text-[#d0bcff] mb-1.5">
                <CountUp end={s.num} duration={1.8} suffix={s.suffix} enableScrollSpy scrollSpyOnce />
              </div>
              <div className="text-[10px] uppercase tracking-[.5px] text-[#6f6f7c]">{s.label}</div>
            </div>
          ))}
        </ScrollReveal>
      </section>

      <section id="how-it-works" className="relative w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-20">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <h2 className="font-display text-[26px] sm:text-[32px] leading-[1.25] text-[#e4e1e8]">
            four steps.<br />zero surprises.
          </h2>
          <span className="text-[11px] uppercase tracking-[.5px] text-[#6f6f7c] mb-1">// how it works</span>
        </ScrollReveal>
        <ScrollRevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <ScrollRevealItem key={s.n} className="rounded-2xl border border-white/[.08] p-5" style={{ background: "#131317" }}>
              <div className="font-display text-[15px] text-[#d0bcff] mb-4">{s.n}</div>
              <div className="text-[14px] font-semibold text-[#e4e1e8] mb-2">{s.t}</div>
              <div className="text-[12px] leading-[1.6] text-[#8a8697]">{s.d}</div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </section>

      <section className="relative w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-14">
        <ScrollReveal className="relative rounded-[26px] border border-white/[.08] px-7 sm:px-12 py-12 overflow-hidden" style={{ background: "#131317" }}>
          <div className="dot-grid absolute inset-0 opacity-[0.08] pointer-events-none" />
          <div className="relative flex items-center justify-between gap-8">
            <div>
              <div className="font-display text-[42px] text-[#494454] leading-none mb-3">&ldquo;</div>
              <p className="text-[19px] sm:text-[22px] leading-[1.5] text-[#e4e1e8] max-w-[640px] mb-6">
                three mock interviews and my real one felt like practice round four.{" "}
                <span className="italic" style={{ color: "#a3c9ff" }}>i walked in already warmed up.</span>
              </p>
              <div className="text-[11px] uppercase tracking-[.5px] text-[#6f6f7c]">&mdash; priya &middot; hyderabad &middot; sde ii @ stripe</div>
            </div>
            {/* Fixed pixel box + overflow-hidden, not a percentage height —
                a <video>'s intrinsic aspect ratio fights percentage heights
                inside an auto-sized flex row, which is why it was rendering
                small and anchored to the top with dead space below instead
                of actually filling the card. This way object-cover has an
                unambiguous box to fill edge-to-edge. */}
            <div className="hidden md:block relative w-[500px] h-[300px] rounded-xl border border-white/[.08] overflow-hidden flex-none">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src="/welcom_screen.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="cta" className="relative w-full px-5 sm:px-8 lg:px-14 xl:px-20 mt-14 pb-10">
        <ScrollReveal
          className="relative overflow-hidden rounded-[26px] border px-6 sm:px-11 py-14 text-center"
          style={{ borderColor: "rgba(208,188,255,.18)", background: "radial-gradient(600px 260px at 50% 0,rgba(208,188,255,.14),transparent), #0e0e12" }}
        >
          <h2 className="font-display text-[26px] sm:text-[34px] text-[#e4e1e8] mb-3.5 leading-[1.2]">
            your next interview is a<br />rehearsal away.
          </h2>
          <p className="text-[#958ea0] text-[13.5px] mx-auto mb-7 max-w-[420px]">free to start. no card. just you and your coach.</p>
          <button
            onClick={() => router.push("/login")}
            className="text-[13.5px] uppercase tracking-[.4px] font-semibold px-8 py-3.5 rounded-[10px] transition-all duration-200 hover:scale-[1.03] hover:brightness-110"
            style={{ background: "#d0bcff", color: "#3c0091", boxShadow: "0 14px 34px rgba(208,188,255,.28)" }}
          >
            create free account
          </button>
        </ScrollReveal>

        <div
          className="relative flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 px-6 py-5 border-t border-white/[.06] text-[#5c5c68] text-[10.5px] uppercase tracking-[.4px]"
          style={{ background: "#131317" }}
        >
          <span>&copy; 2026 prepai // artificial intelligence interview systems</span>
          <span className="flex gap-5">
            <span>privacy policy</span>
            <span>terminal_os</span>
            <span>system status</span>
            <button onClick={() => router.push("/support")} className="uppercase hover:text-[#e4e1e8] transition-colors duration-200 cursor-pointer">contact</button>
          </span>
        </div>
      </section>

      {/* The logo itself — a single element that starts centered/large inside
          the pinned stage and is the SAME element that ends up sitting
          exactly over the navbar logo slot (see the effect above). It's
          `position: fixed`, so it renders above everything regardless of
          where it sits in the DOM. Deliberately no CSS keyframe animation
          touching `transform` here — the scroll effect owns `transform`
          exclusively, every frame, from the start; a competing CSS
          animation with fill-mode:both would hold its own transform value
          and fight the JS-driven one on every tick. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ghostRef}
        src="/logo.png"
        alt="PrepAI"
        className="fixed top-1/2 left-1/2 z-[95] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] object-contain pointer-events-none motion-reduce:hidden"
        style={{ transform: "translate3d(-50%, -50%, 0) scale(1)" }}
      />
    </div>
  );
}
