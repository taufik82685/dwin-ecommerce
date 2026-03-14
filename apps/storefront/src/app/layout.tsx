import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import dynamic from "next/dynamic";
import ChatbotWidget from "@/components/ChatbotWidget";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DWIN Store Enterprise V2",
  description: "Advanced Cyberpunk Gaming Ecommerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThreeBackground />
        <Navigation />
        <ChatbotWidget />
        <main className="pt-20 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
