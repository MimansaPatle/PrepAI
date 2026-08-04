"use client";
import React, { useEffect, useState } from "react";
import { Save, Target, Flame, Zap, Trophy } from "lucide-react";
import { Robot, Card, fieldClass, labelClass, SkillTagInput, AutocompleteInput, SKILL_SUGGESTIONS, COMPANY_SUGGESTIONS } from "@/components/ui/Brand";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProfileView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [favoriteRole, setFavoriteRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [skills, setSkills] = useState("");

  const [stats, setStats] = useState({ interviewCount: 0, averageScore: 0 });
  const [hasHighScore, setHasHighScore] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [prefs, setPrefs] = useState({
    weeklyEmail: true,
    roleRecommendations: true,
    practiceReminders: false,
  });

  const { showToast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.success) {
          const user = data.user;
          setName(user.name || "");
          setEmail(user.email || "");
          setExperience(user.experience || "Fresher");
          setFavoriteRole(user.favoriteRole || "Frontend Developer");
          setTargetCompany(user.targetCompany || "");
          setSkills(user.skills || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.success) {
          setStats({ interviewCount: data.interviewCount ?? 0, averageScore: data.averageScore ?? 0 });
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const res = await fetch("/api/interview/history");
        const data = await res.json();
        if (data.success) {
          setHasHighScore(data.interviews.some((i) => (i.feedback?.score ?? 0) >= 90));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, experience, favoriteRole, targetCompany, skills }),
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          setSaving(false);
          showToast({ title: "Profile synchronized", description: "Your interview preferences have been updated successfully." });
        }, 700);
        return;
      }

      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[58vh] flex flex-col items-center justify-center text-center animate-rise">
        <Robot v="a" className="w-[110px] h-auto animate-bob mb-6" />
        <p className="text-[#8a8a97] text-[13px] tracking-[.3px]">loading profile…</p>
      </div>
    );
  }

  const readiness = Math.min(100, stats.averageScore);
  const readinessLabel = readiness >= 75 ? "strong" : readiness >= 50 ? "developing" : "needs work";

  const achievements = [
    { icon: Target, title: "First 90+", desc: "Top-tier answer", unlocked: hasHighScore },
    { icon: Flame, title: "6-day streak", desc: "Coming soon", unlocked: false },
    { icon: Zap, title: "Speed runner", desc: "Coming soon", unlocked: false },
    { icon: Trophy, title: "Placement ready", desc: readiness >= 75 ? "Unlocked" : "Locked", unlocked: readiness >= 75 },
  ];

  return (
    <div className="animate-rise">
      <div className="flex items-center justify-between mb-[22px] gap-4 flex-wrap">
        <div>
          <h1 className="font-extrabold text-[24px] sm:text-[26px] mb-[5px] tracking-[-.8px]">Engineer profile</h1>
          <p className="text-[#8a8a97] text-[12.5px]">Manage core configuration and pipeline targets.</p>
        </div>
        <span className="inline-flex items-center gap-2 text-[11.5px] px-3 py-[7px] rounded-full border border-good/30 text-good" style={{ background: "rgba(52,211,153,.08)" }}>
          <span className="w-[7px] h-[7px] rounded-full bg-good" />verified node
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-[18px]">
        <Card className="p-[26px] text-center h-fit">
          <Robot v="b" className="w-24 h-auto mx-auto mb-1.5 block animate-bob" />
          <div className="font-extrabold text-[17px]">{name || "—"}</div>
          <div className="text-[12px] text-[#8a8a97] mb-[18px]">{favoriteRole}</div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-[13px] bg-field rounded-xl">
              <div className="text-[9.5px] text-[#7a7a87] tracking-[.4px]">TARGET CO.</div>
              <div className="font-semibold text-[13px] mt-1 truncate">{targetCompany || "—"}</div>
            </div>
            <div className="p-[13px] bg-field rounded-xl">
              <div className="text-[9.5px] text-[#7a7a87] tracking-[.4px]">EXP.</div>
              <div className="font-semibold text-[13px] mt-1">{experience}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
            <div className="p-[13px] bg-field rounded-xl">
              <div className="text-[9.5px] text-[#7a7a87] tracking-[.4px]">INTERVIEWS</div>
              <div className="font-bold text-[16px] mt-1 text-purple-light">{stats.interviewCount}</div>
            </div>
            <div className="p-[13px] bg-field rounded-xl">
              <div className="text-[9.5px] text-[#7a7a87] tracking-[.4px]">AVG SCORE</div>
              <div className="font-bold text-[16px] mt-1 text-good">{stats.averageScore}%</div>
            </div>
          </div>

          <div className="mt-3.5 text-left">
            <div className="flex justify-between text-[9.5px] text-[#7a7a87] tracking-[.4px] mb-[7px]">
              <span>PLACEMENT READINESS</span>
              <span className="text-good">{readinessLabel}</span>
            </div>
            <div className="h-[7px] bg-field rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${readiness}%`, background: "linear-gradient(90deg,#8b5cf6,#34d399)" }} />
            </div>
          </div>
        </Card>

        <Card className="p-[22px] sm:p-[26px]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className={labelClass}>FULL NAME</div>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <div className={labelClass}>EMAIL</div>
                <input required value={email} disabled className={`${fieldClass} opacity-60 cursor-not-allowed`} />
              </div>
              <div>
                <div className={labelClass}>EXPERIENCE TIER</div>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className={fieldClass}>
                  <option value="Fresher">Fresher</option>
                  <option value="1–2 Years">1–2 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>
              <div>
                <div className={labelClass}>TARGET TRACK</div>
                <select value={favoriteRole} onChange={(e) => setFavoriteRole(e.target.value)} className={fieldClass}>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Python Developer">Python Developer</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <div className={labelClass}>TARGET ORGANIZATION</div>
              <AutocompleteInput value={targetCompany} onChange={setTargetCompany} suggestions={COMPANY_SUGGESTIONS} placeholder="type" />
            </div>

            <div className={labelClass}>CORE TECH STACK</div>
            <div className="mb-[22px]">
              <SkillTagInput value={skills} onChange={setSkills} suggestions={SKILL_SUGGESTIONS} placeholder="type" />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 border-0 text-white px-[22px] py-[11px] rounded-[11px] text-[13px] font-semibold disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save profile
                </>
              )}
            </button>
          </form>
        </Card>
      </div>

      <div className="mt-[22px]">
        <div className="text-[11px] text-purple tracking-[.8px] mb-3 uppercase">// achievements</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="p-[18px] bg-panel border rounded-[15px] text-center"
              style={{ borderColor: a.unlocked ? "rgba(139,92,246,.28)" : "rgba(255,255,255,.07)", opacity: a.unlocked ? 1 : 0.42 }}
            >
              <a.icon className="w-6 h-6 mx-auto mb-2.5 text-purple-light" />
              <div className="font-semibold text-[12px] mb-[3px]">{a.title}</div>
              <div className="text-[10px] text-[#7a7a87] leading-[1.4]">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
