import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Admin Control | EsportsGear",
  description: "Advanced Cyberpunk Gaming Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white flex h-screen overflow-hidden`}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-[#0A0A0A] border-r border-cyan-900/50 flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <span className="text-xl font-black text-white tracking-widest">
              ADMIN<span className="text-cyan-400">PANEL</span>
            </span>
          </div>
          <nav className="flex-1 p-4 space-y-2 relative z-10">
            {['Dashboard', 'Products', 'Categories', 'Orders', 'Banners', 'Settings'].map((item) => (
              <a key={item} href={`/${item.toLowerCase() === 'dashboard' ? '' : item.toLowerCase()}`} className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-colors border border-transparent hover:border-cyan-900/50">
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
