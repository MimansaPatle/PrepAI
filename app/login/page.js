import LoginView from "@/components/LoginView";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <LoginView />
      </main>
    </div>
  );
}