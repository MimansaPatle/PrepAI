"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { Robot, Card, fieldClass, labelClass } from "@/components/ui/Brand";
import { useToast } from "@/components/ui/ToastProvider";

export default function LoginView() {
  const pathname = usePathname();
  const [authMode, setAuthMode] = useState(pathname === "/signup" ? "register" : "login");
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [favoriteRole, setFavoriteRole] = useState("Frontend Developer");
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
          title: "Account created",
          description: "Sign in with your new credentials to continue.",
        });
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
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
    <div className="relative w-full min-h-screen flex items-center justify-center p-6 sm:p-10 overflow-hidden">
      <div
        className="absolute w-[520px] h-[520px] rounded-full animate-glowpulse pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(139,92,246,.28),rgba(91,155,232,.1) 55%,transparent 70%)", filter: "blur(30px)" }}
      />
      <div className="w-full max-w-[440px] relative">
        <div className="text-center mb-[22px]">
          <Robot v="b" className="w-[82px] h-auto mx-auto animate-bob mb-2" />
          <h2 className="font-extrabold text-2xl mb-1.5 tracking-[-.8px]">{signup ? "create account" : "welcome back"}</h2>
          <p className="text-[#8a8a97] text-[12.5px]">{signup ? "register and meet your coach in under a minute" : "sign in to continue your prep journey"}</p>
        </div>

        <Card className="p-7">
          <div className="flex bg-field border border-white/[.06] rounded-xl p-[5px] mb-[22px]">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setAuthMode(t === "signup" ? "register" : "login"); setError(""); }}
                className="flex-1 py-2.5 rounded-[9px] border-0 text-[12.5px] font-semibold cursor-pointer uppercase tracking-[.4px]"
                style={
                  (t === "signup" ? signup : !signup)
                    ? { background: "rgba(139,92,246,.18)", color: "#c4b5fd" }
                    : { background: "transparent", color: "#7a7a87" }
                }
              >
                {t === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-bad/10 border border-bad/20 text-bad text-xs py-2.5 px-4 rounded-xl mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {signup && (
              <div>
                <div className={labelClass}>FULL NAME</div>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="alex morgan" className={fieldClass} />
              </div>
            )}

            <div>
              <div className={labelClass}>EMAIL ADDRESS</div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={fieldClass} />
            </div>

            {signup && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className={labelClass}>EXPERIENCE</div>
                    <select value={experience} onChange={(e) => setExperience(e.target.value)} className={fieldClass}>
                      <option>Fresher</option>
                      <option>1–2 Years</option>
                      <option>3+ Years</option>
                    </select>
                  </div>
                  <div>
                    <div className={labelClass}>TARGET ROLE</div>
                    <select value={favoriteRole} onChange={(e) => setFavoriteRole(e.target.value)} className={fieldClass}>
                      <option value="Frontend Developer">Frontend</option>
                      <option value="Backend Developer">Backend</option>
                      <option value="Full Stack Developer">Full Stack</option>
                      <option value="Python Developer">Python Dev</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <div className={labelClass}>PASSCODE</div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={fieldClass} />
              {signup && password.length > 0 && (
                <div className="mt-3 rounded-xl border border-white/[.08] bg-field p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7a7a87]">Password requirements</p>
                  <PasswordItem ok={passwordChecks.length} text="At least 8 characters" />
                  <PasswordItem ok={passwordChecks.uppercase} text="One uppercase letter" />
                  <PasswordItem ok={passwordChecks.lowercase} text="One lowercase letter" />
                  <PasswordItem ok={passwordChecks.number} text="One number" />
                  <PasswordItem ok={passwordChecks.special} text="One special character" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full border-0 text-white py-[13px] rounded-xl text-[14px] font-semibold disabled:opacity-60 mt-1"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 10px 26px rgba(124,58,237,.36)" }}
            >
              {submitting ? "Please wait…" : signup ? "Create account" : "Sign in"}
            </button>
          </form>
        </Card>

        <div className="text-center mt-4">
          <span onClick={() => router.push("/")} className="inline-flex items-center gap-1.5 text-[11.5px] text-[#6f6f7c] cursor-pointer uppercase tracking-[.5px]"><ArrowLeft className="w-3.5 h-3.5" /> back to home</span>
        </div>
      </div>
    </div>
  );
}

function PasswordItem({ ok, text }) {
  return (
    <div className={`flex items-center gap-2 text-sm transition ${ok ? "text-good" : "text-[#6f6f7c]"}`}>
      {ok ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  );
}
