"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Code,
  Building,
  Save,
  ShieldCheck,
  Bot,
} from "lucide-react";
import AIAssistantToast from "@/components/ui/AIAssistantToast";
import { useToast } from "@/components/ui/ToastProvider";


export default function ProfileView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [favoriteRole, setFavoriteRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [skills, setSkills] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          experience,
          favoriteRole,
          targetCompany,
          skills,
        }),
      });

      const data = await res.json();

      if (data.success) {

        // Keep "Saving..." visible briefly
        setTimeout(() => {

          // Return button to normal
          setSaving(false);

          // Then show the toast
          showToast({
            title: "Profile synchronized",
            description: "Your interview preferences have been updated successfully.",
          });

        }, 700);

        return;
      }

      // If API returns success: false
      setSaving(false);

    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-zinc-500">
        Loading profile...
      </div>
    );
  }
  return (
    <>



      <div className="w-full max-w-4xl mx-auto p-6 md:p-12 space-y-8 animate-fadeIn bg-black text-zinc-100">

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-100">Engineer Profile 🛠️</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage core configuration variables and pipeline tracking targets.</p>
          </div>
          <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Node
          </div>
        </header>

        {/* Save Confirmation Notification */}


        {/* Profile Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side Info Panel */}
          { }
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
            <div className="text-violet-400 bg-zinc-900 p-4 rounded-full border border-zinc-850 mb-3">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-zinc-200">{name}</h2>
            <p className="text-zinc-500 text-xs font-mono mt-0.5">{favoriteRole}</p>

            <div className="w-full mt-6 pt-6 border-t border-zinc-900 grid grid-cols-2 gap-2 text-left">
              <div className="bg-black p-3 rounded-xl border border-zinc-900">
                <span className="text-[10px] text-zinc-600 block uppercase font-mono">Target Company</span>
                <span className="text-xs font-semibold text-zinc-300 mt-1 block truncate">{targetCompany}</span>
              </div>
              <div className="bg-black p-3 rounded-xl border border-zinc-900">
                <span className="text-[10px] text-zinc-600 block uppercase font-mono">Experience</span>
                <span className="text-xs font-semibold text-zinc-300 mt-1 block">{experience}</span>
              </div>
            </div>
          </div>

          {/* Right Side Settings Form */}
          { }
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200"
                    />
                    <User className="absolute left-3 top-3.5 text-zinc-600 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200"
                    />
                    <Mail className="absolute left-3 top-3.5 text-zinc-600 w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Experience tier</label>
                  <div className="relative">
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 appearance-none cursor-pointer"
                    >
                      <option className="bg-black" value="Fresher">Fresher</option>
                      <option className="bg-black" value="1–2 Years">1–2 Years</option>
                      <option className="bg-black" value="3+ Years">3+ Years</option>
                    </select>
                    <Briefcase className="absolute left-3 top-3.5 text-zinc-600 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Primary Target Track</label>
                  <div className="relative">
                    <select
                      value={favoriteRole}
                      onChange={(e) => setFavoriteRole(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 appearance-none cursor-pointer"
                    >
                      <option className="bg-black" value="Frontend Developer">Frontend Developer</option>
                      <option className="bg-black" value="Backend Developer">Backend Developer</option>
                      <option className="bg-black" value="Full Stack Developer">Full Stack Developer</option>
                      <option className="bg-black" value="Python Developer">Python Developer</option>
                    </select>
                    <Code className="absolute left-3 top-3.5 text-zinc-600 w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Target Organization Channel</label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full bg-black border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200"
                  />
                  <Building className="absolute left-3 top-3.5 text-zinc-600 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Core Tech Stack</label>
                <div className="relative">
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-black border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200"
                  />
                  <Code className="absolute left-3 top-3.5 text-zinc-600 w-4 h-4" />
                </div>
              </div>

              {/* Action Footer */}
              { }
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition shadow-lg text-white ${saving
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 opacity-80 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-950/40 hover:scale-[1.01]"
                    }`}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile Settings
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
}