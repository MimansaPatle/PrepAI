import { Suspense } from "react";
import InterviewSession from "@/components/InterviewSession";

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center" style={{ background: "#0e0e12" }}>
          <p className="font-display text-[16px] text-[#958ea0] uppercase tracking-[.2em]">{"// loading_interview"}</p>
        </div>
      }
    >
      <InterviewSession />
    </Suspense>
  );
}
