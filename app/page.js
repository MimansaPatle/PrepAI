"use client";

import { useRouter } from "next/navigation";
import { IoSparkles } from "react-icons/io5";


export default function Home() {
  const router = useRouter();
  

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6">
          <IoSparkles />
          Next-Gen Adaptive AI Interviewing
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Master Your Technical & HR Interviews with AI
        </h1>

        <p className="text-zinc-400 mt-6 max-w-2xl">
          Practice personalized interviews, receive AI-powered feedback,
          discover weak areas and prepare for your dream company.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="mt-10 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 rounded-xl hover:scale-105 transition"
        >
          Start Free
        </button>

      </main>
    </div>
  );
}