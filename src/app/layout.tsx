import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ALEX_SECURITY | Cybersecurity Writeups",
  description: "Personal writeups for HackTheBox, TryHackMe and PicoCTF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
