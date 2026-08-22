"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CheckCircle2, Circle, Mail, TerminalSquare, UserCog, KeyRound, Settings2, Eye, EyeOff } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useToast } from "@/components/ui/ToastProvider";

const EXPERIENCE_TIERS = [
  { label: "junior", value: "Fresher" },
  { label: "mid-level", value: "1–2 Years" },
  { label: "senior", value: "3+ Years" },
];

const ROLE_SUGGESTIONS = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Python Developer",
  "Software Engineer", "Data Scientist", "Data Engineer", "Data Analyst", "ML Engineer",
  "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Mobile Developer",
  "Android Developer", "iOS Developer", "QA Engineer", "Security Engineer",
  "Blockchain Developer", "Game Developer", "UI/UX Designer", "Product Manager",
];

function FieldLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="w-1.5 h-1.5 bg-[#d0bcff] flex-none" />
      <span className="text-[10.5px] font-bold uppercase tracking-[.5px] text-[#e4e1e8]">{children}</span>
    </div>
  );
}

function Field({ icon: Icon, trailing, ...inputProps }) {
  return (
    <div className="flex items-center gap-2.5 border border-[#494454] focus-within:border-[#d0bcff] px-4 py-3.5 transition-colors duration-200" style={{ background: "#1f1f24" }}>
      <Icon className="w-4 h-4 text-white flex-none" />
      <input {...inputProps} className="auth-field-input flex-1 min-w-0 bg-transparent text-[13px] text-white outline-none placeholder:text-white" />
      {trailing}
    </div>
  );
}

function AutocompleteField({ icon: Icon, value, onChange, suggestions, placeholder, required }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const query = value.trim().toLowerCase();
  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query) && s.toLowerCase() !== query).slice(0, 6)
    : [];

  return (
    <div className="relative" ref={wrapRef}>
      <div className="flex items-center gap-2.5 border border-[#494454] focus-within:border-[#d0bcff] px-4 py-3.5 transition-colors duration-200" style={{ background: "#1f1f24" }}>
        <Icon className="w-4 h-4 text-white flex-none" />
        <input
          required={required}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="auth-field-input flex-1 min-w-0 bg-transparent text-[13px] text-white outline-none placeholder:text-white"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 border border-[#494454] max-h-[220px] overflow-y-auto" style={{ background: "#1f1f24" }}>
          {filtered.map((s) => (
            <div
              key={s}
              onMouseDown={() => { onChange(s); setOpen(false); }}
              className="px-4 py-2.5 text-[13px] text-[#e4e1e8] hover:bg-[#2a292e] cursor-pointer"
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBox({ dot, label, value, dim = false }) {
  return (
    <div className={`border px-4 py-3.5 ${dim ? "border-white/[.06]" : "border-white/[.1]"}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2 h-2 flex-none" style={{ background: dim ? "#3a3a42" : dot }} />
        <span className={`text-[10.5px] font-bold uppercase tracking-[.5px] ${dim ? "text-[#5c5c68]" : "text-[#e4e1e8]"}`}>{label}</span>
      </div>
      <div
        className={`border px-3 py-2 text-[11.5px] ${dim ? "border-white/[.06] text-[#4f4f5c]" : "border-white/[.1] text-[#a3c9ff]"}`}
        style={{ background: "#0e0e12" }}
      >
        {value}
      </div>
    </div>
  );
}

export default function LoginView() {
  const pathname = usePathname();
  const [authMode, setAuthMode] = useState(pathname === "/signup" ? "register" : "login");
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setExperience] = useState("Fresher");
  const [favoriteRole, setFavoriteRole] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const signup = authMode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (signup) {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            experience,
            favoriteRole,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
          setSubmitting(false);
          return;
        }

        setAuthMode("login");
        setPassword("");
        showToast?.({
          title: "account created",
          description: "sign in with your new credentials to continue.",
        });
      } catch (err) {
        setError("something went wrong.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("invalid email or password. please try again.");
      setSubmitting(false);
      return;
    }

    const session = await getSession();

    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-10 sm:px-8 sm:py-14" style={{ background: "#0e0e12" }}>
      <div className="dot-grid-terminal fixed inset-0 pointer-events-none" />

      {/* Card is intentionally NOT min-h-screen — that made it fill the
          viewport edge-to-edge with square corners, so it looked fused to
          the browser's top and bottom. Giving it a bounded min-height plus
          a rounded border and centering it in the page reads as a floating
          card instead. */}
      <div className="relative w-full max-w-[1400px] lg:min-h-[620px] rounded-2xl border border-white/[.08] overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* LEFT — form column. Login has far fewer fields than signup, so
            top-anchored flow left it stranded near the top with a large
            dead zone below — center it vertically instead so it reads as a
            deliberately compact panel, not a form that ran out of content.
            Signup already fills the column naturally, so it keeps the
            normal top-down flow. */}
        <div className={`px-6 sm:px-12 lg:px-20 py-8 sm:py-10 ${signup ? "" : "flex items-center"}`} style={{ background: "#131317" }}>
          <div className="max-w-[760px] w-full">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => router.push("/")}
                className="border border-white/[.15] px-4 py-2 text-[15px] font-bold tracking-[1px] text-[#d0bcff] uppercase hover:border-[#d0bcff]/40 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
              >
                prep_ai
              </button>
            </div>
            <div className="border-t border-white/[.08] mb-5" />

            <h1 className="font-display text-[32px] sm:text-[40px] leading-[1.08] mb-4">
              <span className="text-[#e4e1e8]">{signup ? "create your" : "welcome"}</span>{" "}
              <span className="text-[#d0bcff]">{signup ? "account" : "back"}</span>
            </h1>

            <div className="inline-flex items-center border border-white/[.12] px-3.5 py-2 text-[10.5px] uppercase tracking-[.5px] text-[#958ea0] mb-5">
              {signup ? "// takes about a minute" : "// enter your email and password"}
            </div>

            <div className="flex gap-2 mb-5">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setAuthMode(t === "signup" ? "register" : "login"); setError(""); }}
                  className="px-4 py-2 text-[10.5px] uppercase tracking-[.5px] font-semibold border transition-all duration-200 hover:scale-[1.04] cursor-pointer"
                  style={
                    (t === "signup" ? signup : !signup)
                      ? { borderColor: "rgba(208,188,255,.5)", color: "#d0bcff", background: "rgba(208,188,255,.08)" }
                      : { borderColor: "rgba(255,255,255,.1)", color: "#6f6f7c", background: "transparent" }
                  }
                >
                  {t === "login" ? "log in" : "sign up"}
                </button>
              ))}
            </div>

            {error && (
              <div
                className="text-[12px] leading-[1.5] py-2.5 px-4 mb-6 font-medium border"
                style={{ background: "rgba(248,113,113,.08)", borderColor: "rgba(248,113,113,.3)", color: "#f87171" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {signup && (
                <div>
                  <FieldLabel>// your name</FieldLabel>
                  <Field icon={TerminalSquare} required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan Lee" />
                </div>
              )}

              <div>
                <FieldLabel>// email</FieldLabel>
                <Field icon={Mail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>

              {signup && (
                <div>
                  <FieldLabel>// role you are preparing for</FieldLabel>
                  <AutocompleteField
                    icon={UserCog}
                    required
                    value={favoriteRole}
                    onChange={setFavoriteRole}
                    suggestions={ROLE_SUGGESTIONS}
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
              )}

              <div>
                <FieldLabel>// password</FieldLabel>
                <Field
                  icon={KeyRound}
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="flex-none text-[#958ea0] hover:text-[#d0bcff] transition-colors duration-200 cursor-pointer"
                      aria-label={showPassword ? "hide password" : "show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {signup && password.length > 0 && (
                  <div className="mt-3 border border-white/[.08] p-4" style={{ background: "#0e0e12" }}>
                    <p className="text-[9.5px] font-semibold uppercase tracking-[.5px] text-[#6f6f7c] mb-2">password requirements</p>
                    <PasswordItem ok={passwordChecks.length} text="at least 8 characters" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      <PasswordItem ok={passwordChecks.uppercase} text="one uppercase letter" />
                      <PasswordItem ok={passwordChecks.lowercase} text="one lowercase letter" />
                      <PasswordItem ok={passwordChecks.number} text="one number" />
                      <PasswordItem ok={passwordChecks.special} text="one special character" />
                    </div>
                  </div>
                )}
              </div>

              {signup && (
                <div>
                  <FieldLabel>// experience level</FieldLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {EXPERIENCE_TIERS.map((tier) => {
                      const active = experience === tier.value;
                      return (
                        <button
                          key={tier.value}
                          type="button"
                          onClick={() => setExperience(tier.value)}
                          className="py-3.5 text-[11px] uppercase tracking-[.5px] font-semibold border transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                          style={
                            active
                              ? { borderColor: "#d0bcff", color: "#e4e1e8", background: "rgba(208,188,255,.08)", boxShadow: "0 0 0 1px rgba(208,188,255,.5)" }
                              : { borderColor: "rgba(255,255,255,.12)", color: "#e4e1e8", background: "transparent" }
                          }
                        >
                          {tier.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-white/[.08] !mt-6" />

              <button
                type="submit"
                disabled={submitting}
                className="w-full text-[13.5px] uppercase tracking-[.5px] font-bold py-3.5 border transition-all duration-200 hover:scale-[1.01] hover:brightness-125 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                style={{ background: "#1f1f24", borderColor: "rgba(208,188,255,.3)", color: "#d0bcff" }}
              >
                {submitting ? "please wait…" : signup ? "create account »" : "log in »"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => router.push("/")}
                className="inline-flex text-[11px] text-[#6f6f7c] hover:text-[#e4e1e8] uppercase tracking-[.5px] transition-all duration-200 hover:-translate-x-1 cursor-pointer"
              >
                ← back to home
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — live system status sidebar. Always vertically centered,
            regardless of mode: its own content (3-4 short boxes) never
            comes close to filling the tall column the way the signup form
            does, so top-anchoring + mt-auto on the last box just left a
            large dead gap before it — centering the whole group keeps it
            looking intentional instead of stranded. */}
        <div className="hidden lg:flex flex-col gap-5 border-l border-white/[.08] px-8 py-10 justify-center" style={{ background: "#131317" }}>
          <div className="border border-white/[.1] px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-bold uppercase tracking-[.5px] text-[#e4e1e8]">// account status</span>
              <Settings2 className="w-4 h-4 text-[#6f6f7c]" />
            </div>
            <div className="h-[6px] w-full bg-white/[.08]">
              <div className="h-full" style={{ width: "85%", background: "#d0bcff" }} />
            </div>
            <div className="text-right text-[10px] text-[#6f6f7c] uppercase tracking-[.5px] mt-2">looking good</div>
          </div>

          <StatusBox dot="#34d399" label="connection" value="secure" />
          <StatusBox
            dot="#a3c9ff"
            label="email"
            value={email ? `verifying ${email.slice(0, 18)}${email.length > 18 ? "…" : ""}` : "waiting for input…"}
          />
          {signup ? (
            <StatusBox
              dot="#d0bcff"
              label="target role"
              value={favoriteRole ? favoriteRole : "not set yet"}
              dim={!favoriteRole}
            />
          ) : (
            <StatusBox dot="#d0bcff" label="session" value="not started yet" dim />
          )}

          <div className="border border-dashed border-white/[.15] px-4 py-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6f6f7c] uppercase tracking-[.5px]">connection:</span>
              <span className="text-[#e4e1e8]">secure</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6f6f7c] uppercase tracking-[.5px]">encryption:</span>
              <span className="text-[#e4e1e8]">enabled</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6f6f7c] uppercase tracking-[.5px]">your data:</span>
              <span className="text-[#e4e1e8]">private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordItem({ ok, text }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] transition-colors ${ok ? "text-[#34d399]" : "text-[#6f6f7c]"}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5 flex-none" /> : <Circle className="w-3.5 h-3.5 flex-none" />}
      <span>{text}</span>
    </div>
  );
}
