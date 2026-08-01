import LoginView from "@/components/LoginView";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50">
      <main className="flex-1 flex items-center justify-center">
        <LoginView />
      </main>
    </div>
  );
}