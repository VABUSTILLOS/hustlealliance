import type { Metadata } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import ToggleBar from "./components/ToggleBar";
import CursorGlow from "./components/CursorGlow";
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
  title: "Hustle Alliance",
  description: "The premium community for solo founders.",
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
        <Providers>
          <div className="bg-[var(--color-bg)] text-[var(--color-foreground)] min-h-screen font-body">
            <CursorGlow />
            <ToggleBar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
