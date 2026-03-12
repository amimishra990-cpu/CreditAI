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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-gray-100 min-h-screen selection:bg-silver/20`}
      >
        <AuthProvider>
          <ProtectedRoute>
            <BackgroundEffects />
            <div className="flex flex-col min-h-screen">
              <TopBar />
              <main className="flex-1 relative">
                {/* Professional Silver Glow Effects */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C0C0C0]/5 blur-[150px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#808080]/5 blur-[120px] pointer-events-none" />

                {/* Subtle grid pattern */}
                <div className="fixed inset-0 bg-[linear-gradient(rgba(192,192,192,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,192,192,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

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
                background: "#0a0a0a",
                color: "#f5f5f5",
                border: "1px solid rgba(192, 192, 192, 0.2)",
              },
              success: {
                iconTheme: {
                  primary: "#C0C0C0",
                  secondary: "#0a0a0a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#f5f5f5",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
