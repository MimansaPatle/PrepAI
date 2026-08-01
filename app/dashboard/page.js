import Navbar from "@/components/Navbar";
import DashboardView from "@/components/DashboardView";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">

      <Navbar />

      <main className="flex-1">
        <DashboardView />
      </main>

      <Footer />

    </div>
  );
}