// src/app/layout.tsx
import type { Metadata } from "next";
import { Libre_Baskerville, Nunito } from "next/font/google";
import "./globals.css";

// Elegant serif font for headings — feels nostalgic and warm
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

// Friendly rounded font for body text — easy to read
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MelodySnap — Capture a melody, hear it become a song",
  description:
    "A nostalgic songwriting companion. Hum, sing, or whistle your ideas and turn them into playable songs.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${nunito.variable}`}
      >
        {children}
      </body>
    </html>
  );
}