"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { 
  IoTerminalOutline, 
  IoLockClosedOutline, 
  IoMailOutline, 
  IoPersonOutline,
  IoBriefcaseOutline, 
  IoCodeSlashOutline, 
  IoBusinessOutline, 
  IoBuildOutline 
} from 'react-icons/io5';
import { signIn } from "next-auth/react";

export default function LoginView({ onLogin }) {
  // Mode switcher state: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');
  const router = useRouter();
  
  // Input tracking states configured with your default schema parameters
  const [name, setName] = useState('Mimansa');
  const [email, setEmail] = useState('mimansa@test.com');
  const [password, setPassword] = useState('123456');
  const [experience, setExperience] = useState('Fresher');
  const [favoriteRole, setFavoriteRole] = useState('Frontend Developer');
  const [targetCompany, setTargetCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // ---------- REGISTER ----------
  if (authMode === "register") {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          experience,
          favoriteRole,
          targetCompany,
          skills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      alert("Account created successfully!");

      setAuthMode("login");

    } catch (error) {
      setError("Something went wrong.");
    }

    return;
  }

  // ---------- LOGIN ----------
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    setError(result.error);
    return;
  }

  router.push("/dashboard");
};

  const toggleMode = () => {
    setError('');
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md mx-4 transition-all duration-300">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-3 rounded-xl text-white mb-3 shadow-md shadow-violet-600/10">
          <IoTerminalOutline className="text-2xl" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          {authMode === 'login' ? 'Welcome to PrepAI' : 'Create Sandbox Account'}
        </h2>
        <p className="text-zinc-500 text-xs mt-1 text-center">
          {authMode === 'login' 
            ? 'Sign in to initialize your automated workspace' 
            : 'Register your engineering credentials to start simulation metrics'
          }
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs py-2.5 px-4 rounded-xl mb-4 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Conditional Field: Registration Full Name Display */}
        {authMode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mimansa Patle" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 placeholder:text-zinc-700" 
              />
              <IoPersonOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
            </div>
          </div>
        )}

        {/* Email Field (Required for both login/signup verification paths) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@domain.com" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 placeholder:text-zinc-700" 
            />
            <IoMailOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
          </div>
        </div>

        {/* Conditional Fields: Registration Meta Schema */}
        {authMode === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Experience</label>
                <div className="relative">
                  <select 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 appearance-none cursor-pointer"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="1-2 Years">1–2 Years</option>
                    <option value="3+ Years">3+ Years</option>
                  </select>
                  <IoBriefcaseOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Favorite Role</label>
                <div className="relative">
                  <select 
                    value={favoriteRole}
                    onChange={(e) => setFavoriteRole(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 appearance-none cursor-pointer"
                  >
                    <option value="Frontend Developer">Frontend</option>
                    <option value="Backend Developer">Backend</option>
                    <option value="Full Stack Developer">Full Stack</option>
                    <option value="Python Developer">Python Dev</option>
                  </select>
                  <IoCodeSlashOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Target Company</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g., Google, Amazon" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 placeholder:text-zinc-700" 
                />
                <IoBusinessOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Core Skills Matrix</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., React, Tailwind CSS, JavaScript" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 placeholder:text-zinc-700" 
                />
                <IoBuildOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
              </div>
            </div>
          </>
        )}

        {/* Passcode Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Passcode</label>
          <div className="relative">
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition text-zinc-200 placeholder:text-zinc-700" 
            />
            <IoLockClosedOutline className="absolute left-3 top-3.5 text-zinc-600 text-base" />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-violet-600/10 mt-2 hover:scale-[1.01]"
        >
          {authMode === 'login' ? 'Authenticate Session' : 'Register & Instantiate'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
        <button 
          onClick={toggleMode}
          className="text-xs text-zinc-400 hover:text-violet-400 transition underline decoration-zinc-700 underline-offset-4"
        >
          {authMode === 'login' 
            ? "Don't have an account? Sign up here" 
            : 'Already registered? Return to login'
          }
        </button>
      </div>
    </div>
  );
}