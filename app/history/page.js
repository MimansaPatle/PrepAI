import Navbar from "@/components/Navbar";
import HistoryView from "@/components/HistoryView";
import Footer from "@/components/Footer";

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">

      <Navbar />

      <main className="flex-1">
        <HistoryView />
      </main>

      <Footer />

    </div>
  );
}