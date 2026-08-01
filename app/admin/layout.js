import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

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
  <>
    <AdminNavbar />
    {children}
  </>
);
}