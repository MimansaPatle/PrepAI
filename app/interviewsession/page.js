import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import InterviewSession from "@/components/InterviewSession";
import Footer from "@/components/Footer";

export default function InterviewPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center text-[#8a8a97]">
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