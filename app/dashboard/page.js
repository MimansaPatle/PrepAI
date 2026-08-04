import Navbar from "@/components/Navbar";
import DashboardView from "@/components/DashboardView";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-[34px] pb-14">
        <DashboardView />
      </main>
      <Footer />
    </div>
  );
}