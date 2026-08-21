import DashboardSidebar from "@/components/DashboardSidebar";
import SupportView from "@/components/SupportView";

export default function SupportPage() {
  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen" style={{ background: "#131317" }}>
      <div className="dot-grid-terminal fixed inset-0 pointer-events-none" />
      <DashboardSidebar />
      <div className="relative flex-1 min-w-0 flex flex-col">
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8 sm:py-12 lg:pl-12">
          <SupportView />
        </main>
      </div>
    </div>
  );
}
