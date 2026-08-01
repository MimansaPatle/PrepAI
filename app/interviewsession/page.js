import Navbar from "@/components/Navbar";
import InterviewSession from "@/components/InterviewSession";
import Footer from "@/components/Footer";

export default function InterviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">

      <Navbar />

      <main className="flex-1">
        <InterviewSession />
      </main>

      <Footer />

    </div>
  );
}