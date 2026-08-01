import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import InterviewSession from "@/components/InterviewSession";
import Footer from "@/components/Footer";

export default function InterviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">

      <Navbar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
              Loading interview...
            </div>
          }
        >
          <InterviewSession />
        </Suspense>
      </main>

      <Footer />

    </div>
  );
}