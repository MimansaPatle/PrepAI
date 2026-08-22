import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }) {
  const session = await auth();

  // User is not logged in
  if (!session) {
    redirect("/login");
  }

  // User is logged in but is not an admin
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen" style={{ background: "#131317" }}>
      <div className="dot-grid-terminal fixed inset-0 pointer-events-none" />
      <AdminSidebar />
      <div className="relative flex-1 min-w-0">{children}</div>
    </div>
  );
}
