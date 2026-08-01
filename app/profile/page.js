import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileView from "@/components/ProfileView";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar
        currentView="profile"
        username="Mimansa 👋"
      />

      <main className="flex-1">
        <ProfileView />
      </main>

      <Footer />
    </div>
  );
}