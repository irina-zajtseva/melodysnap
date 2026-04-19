// src/app/layout.tsx
import { AuthProvider } from "@/components/AuthContext";
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
  manifest: "/manifest.json",
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
        {/* Splash Screen */}
        <div
          id="splash-screen"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#FFF8F0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            transition: "opacity 0.5s ease",
          }}
        >
          <div style={{
            animation: "fadeIn 0.6s ease",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}>
              🎵
            </div>
            <h1 style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#2D1810",
              marginBottom: "0.5rem",
            }}>
              MelodySnap
            </h1>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.95rem",
              color: "#E8985A",
              fontStyle: "italic",
            }}>
              Capture a melody. Hear it become a song.
            </p>
            {/* Loading dots */}
            <div style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              marginTop: "2rem",
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#E07A5F",
                animation: "pulse 1.4s ease-in-out infinite",
              }} />
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#E07A5F",
                animation: "pulse 1.4s ease-in-out 0.2s infinite",
              }} />
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#E07A5F",
                animation: "pulse 1.4s ease-in-out 0.4s infinite",
              }} />
            </div>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  var splash = document.getElementById('splash-screen');
                  if (splash) {
                    splash.style.opacity = '0';
                    setTimeout(function() {
                      splash.style.display = 'none';
                    }, 500);
                  }
                }, 800);
              });
            `,
          }}
        />

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}