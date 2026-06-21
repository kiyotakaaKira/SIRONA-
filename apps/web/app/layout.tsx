import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { GlobalSidebar } from "../components/GlobalSidebar";
import { SessionHydrator } from "../components/SessionHydrator";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Sirona AI",
  description: "Patient-Owned Prescription Intelligence Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} antialiased min-h-screen`}>
        <div className="bg-mesh" />
        <div className="bg-mesh-animated" aria-hidden />
        <div className="bg-noise" />
        <SessionHydrator />
        <GlobalSidebar />
        {children}
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}
