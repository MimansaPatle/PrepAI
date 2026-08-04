// app/layout.js
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jetbrains",
});

export const metadata = {
  title: "PrepAI — AI Interview Preparation",
  description: "Practice technical interviews with a personalized AI coach.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrains.variable} h-full antialiased dark`}>
      <body className="prepai-bg min-h-full flex flex-col font-mono text-[#f2f2f5] tracking-[-0.3px]">
        <AuthSessionProvider>
          <ToastProvider>
          {children}
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}