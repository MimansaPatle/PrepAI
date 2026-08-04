import React from "react";

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[.06] text-[#5c5c68] text-[11px] uppercase tracking-[.5px]">
        <span>© 2026 prepai — build your future</span>
        <span className="flex gap-5">
          <span>privacy</span>
          <span>terms</span>
          <span>support</span>
        </span>
      </div>
    </footer>
  );
}
