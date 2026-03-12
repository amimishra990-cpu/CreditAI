import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { TopBar } from "@/components/Layout/TopBar";
import { BackgroundEffects } from "@/components/Layout/BackgroundEffects";
import ProtectedRoute from "@/components/ProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreditAI - Secure Credit Appraisal System",
  description: "Enterprise-grade AI-powered credit appraisal and risk assessment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030712] text-gray-100 min-h-screen selection:bg-brand/30`}
      >
        <AuthProvider>
          <ProtectedRoute>
            <BackgroundEffects />
            <div className="flex flex-col min-h-screen">
              <TopBar />
              <main className="flex-1 relative">
                {/* Glow effects */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  {children}
                </div>
              </main>
            </div>
          </ProtectedRoute>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#f8fafc",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#f8fafc",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
