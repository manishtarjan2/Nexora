import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nexora - The Future of Video",
  description: "Next-gen video platform with ultra-low latency Shorts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex font-[family-name:var(--font-inter)] text-white bg-[#0A0B10]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col min-h-screen">
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
