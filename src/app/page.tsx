// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RecordButton from "@/components/RecordButton";
import ProjectList from "@/components/ProjectList";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not signed in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Show nothing while checking auth
  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#E8985A", fontFamily: "'Nunito', sans-serif" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header
          style={{
            paddingTop: "3rem",
            paddingBottom: "0.5rem",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#2D1810",
              letterSpacing: "-0.5px",
              marginBottom: "0.5rem",
            }}
          >
            MelodySnap
          </h1>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.05rem",
              color: "#E8985A",
              fontStyle: "italic",
            }}
          >
            Capture a melody. Hear it become a song.
          </p>

          {/* Welcome + Sign Out */}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.85rem",
                color: "#6B3A2A",
              }}
            >
              Hi, {user.name}!
            </span>
            <button
              onClick={logout}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "8px",
                border: "1.5px solid rgba(107, 58, 42, 0.15)",
                backgroundColor: "transparent",
                color: "#6B3A2A",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                opacity: 0.6,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.borderColor = "#E07A5F";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.15)";
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 0",
            width: "100%",
            animation: "fadeIn 0.6s ease",
          }}
        >
          <RecordButton />
        </section>

        {/* Project List */}
        <section
          style={{
            width: "100%",
            paddingBottom: "3rem",
            animation: "fadeIn 0.8s ease",
          }}
        >
          <ProjectList />
        </section>
      </div>
    </main>
  );
}