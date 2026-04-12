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
        backgroundColor: "var(--color-cream)",
      }}
    >
      {/* Header */}
      <header
        style={{
          paddingTop: "3rem",
          paddingBottom: "1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "var(--color-dark)",
            letterSpacing: "-0.5px",
            marginBottom: "0.5rem",
          }}
        >
          MelodySnap
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--color-amber)",
            fontStyle: "italic",
          }}
        >
          Capture a melody. Hear it become a song.
        </p>
      </header>

      {/* Main Content — Record Button */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "6rem",
        }}
      >
        <RecordButton />
      </section>

      {/* Recent Projects */}
<section
  style={{
    width: "100%",
    maxWidth: "500px",
    padding: "0 1.5rem 2rem",
  }}
>
  <ProjectList />
</section>
    </main>
  );
}