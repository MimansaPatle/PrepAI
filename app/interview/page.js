import Navbar from "@/components/Navbar";
import InterviewSetup from "@/components/InterviewSetup";
import Footer from "@/components/Footer";

export default function InterviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">

      <Navbar />

      <main className="flex-1">
        <InterviewSetup />
      </main>

      <Footer />

    </div>
  );
}