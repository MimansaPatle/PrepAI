"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackReport from "@/components/FeedbackReport";

export default function FeedbackPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">

      <Navbar />

      <main className="flex-1">
        <FeedbackReport />
      </main>

      <Footer />

    </div>
  );
}