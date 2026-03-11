import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Layout/Sidebar";
import { TopBar } from "@/components/Layout/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreditAI - Premium Risk Intelligence",
  description: "Advanced credit appraisal and risk detection system powered by AI.",
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
        <Sidebar>
          <div className="flex flex-col min-h-screen">
             <TopBar />
             <div className="flex-1 p-6 z-10">
               {children}
             </div>
          </div>
        </Sidebar>
      </body>
    </html>
  );
}
