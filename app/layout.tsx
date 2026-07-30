import type { Metadata } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import ToggleBar from "./components/ToggleBar";
import CursorGlow from "./components/CursorGlow";
import { WebVitals } from "./components/WebVitals";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Hustle Alliance — The Founder's Collective",
  description: "The premium community for solo founders. Join 2,400+ founders building together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[var(--color-bg)]">
        {/* Preconnect to external image origins — saves ~150ms DNS+TLS on first load */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://yftgdtdvmvvqyzcdntge.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="anonymous" />
        <Providers>
          <div className="bg-[var(--color-bg)] text-[var(--color-foreground)] min-h-screen font-body">
            <CursorGlow />
            <ToggleBar />
            <WebVitals />
            {children}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
