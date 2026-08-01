import React from 'react';
import { IoTerminalOutline } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 px-6 py-8 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
            <IoTerminalOutline className="text-zinc-400" />
          </div>
          <span className="font-semibold text-zinc-400">&copy; 2026 PrepAI. Build Your Future.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-300 transition">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300 transition">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300 transition">Support Matrix</a>
        </div>
      </div>
    </footer>
  );
}