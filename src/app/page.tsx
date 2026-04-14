// src/app/page.tsx
import RecordButton from "@/components/RecordButton";
import ProjectList from "@/components/ProjectList";

export default function Home() {
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
      {/* Single container for consistent alignment */}
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