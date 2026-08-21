// app/layout.js
import { JetBrains_Mono, DotGothic16 } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jetbrains",
});

const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dotgothic",
});

export const metadata = {
  title: "PrepAI — AI Interview Preparation",
  description: "Practice technical interviews with a personalized AI coach.",
  icons: {
    icon: [
      { url: "/icon-light.svg", media: "(prefers-color-scheme: light)" },
      { url: "/icon-192.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jetbrains.variable} ${dotGothic.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col font-mono text-[#e4e1e8] tracking-[-0.3px]" style={{ background: "#131317" }}>
        <AuthSessionProvider>
          <ToastProvider>
          {children}
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}