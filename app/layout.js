// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrepAI - Interview Simulator",
  description: "AI-Powered Adaptive Interview Preparation Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      {/* Changed bg class to zinc-950 to fit the modern dark look */}
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <AuthSessionProvider>
          <ToastProvider>
          {children}
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}