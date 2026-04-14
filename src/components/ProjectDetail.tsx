// src/components/ProjectDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  duration: number;
  mood: string;
  style: string;
  arrangement: string;
  createdAt: string;
};

export default function ProjectDetail({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}/details`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const togglePlay = () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    const newAudio = new Audio(`/api/projects/${id}/audio`);
    newAudio.play();
    newAudio.onended = () => {
      setIsPlaying(false);
      setAudio(null);
    };
    setIsPlaying(true);
    setAudio(newAudio);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this idea?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const startEditingTitle = () => {
    if (!project) return;
    setEditTitle(project.title);
    setIsEditingTitle(true);
  };

  const saveTitle = async () => {
    if (!project || !editTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (response.ok) {
        setProject({ ...project, title: editTitle.trim() });
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }

    setIsEditingTitle(false);
  };

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = `/api/projects/${id}/audio`;
    link.download = `${project?.title || "melody"}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#E8985A" }}>Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <p style={{ color: "#2D1810", fontSize: "1.1rem" }}>Idea not found</p>
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#E07A5F",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div
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
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: "2rem",
            padding: "0.5rem 0",
            border: "none",
            backgroundColor: "transparent",
            color: "#6B3A2A",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ← Back to ideas
        </button>

        {/* Editable Title */}
        {isEditingTitle ? (
          <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              onBlur={saveTitle}
              autoFocus
              style={{
                width: "100%",
                fontFamily: "var(--font-heading)",
                fontSize: "2rem",
                fontWeight: "700",
                color: "#2D1810",
                border: "none",
                borderBottom: "2px solid #E07A5F",
                backgroundColor: "transparent",
                outline: "none",
                padding: "0.25rem 0",
              }}
            />
          </div>
        ) : (
          <h1
            onClick={startEditingTitle}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#2D1810",
              marginTop: "1.5rem",
              marginBottom: "0.5rem",
              cursor: "pointer",
              borderBottom: "2px solid transparent",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottom = "2px dashed #E8D5C8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottom = "2px solid transparent";
            }}
            title="Click to edit title"
          >
            {project.title}
          </h1>
        )}

        <p
          style={{
            fontSize: "0.85rem",
            color: "#6B3A2A",
            opacity: 0.6,
            marginBottom: "2rem",
          }}
        >
          {formatDate(project.createdAt)}
        </p>

        {/* Play button card */}
        <div
          style={{
            backgroundColor: "#FFFDF9",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 30px rgba(107, 58, 42, 0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={togglePlay}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: isPlaying ? "#E05A5A" : "#E07A5F",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 20px rgba(224, 122, 95, 0.3)",
            }}
          >
            {isPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#2D1810",
              fontWeight: "600",
            }}
          >
            {formatTime(project.duration)}
          </p>

          {/* Download button */}
          <button
            onClick={downloadAudio}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.25rem",
              borderRadius: "10px",
              border: "1.5px solid rgba(107, 58, 42, 0.15)",
              backgroundColor: "transparent",
              color: "#6B3A2A",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#E07A5F";
              e.currentTarget.style.color = "#E07A5F";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.15)";
              e.currentTarget.style.color = "#6B3A2A";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Recording
          </button>
        </div>

        {/* Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {project.mood && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                backgroundColor: "#FFFDF9",
                borderRadius: "12px",
                border: "1px solid rgba(107, 58, 42, 0.08)",
              }}
            >
              <span
                style={{ fontSize: "0.85rem", color: "#6B3A2A", opacity: 0.6 }}
              >
                Mood
              </span>
              <span
                style={{ fontSize: "0.95rem", color: "#2D1810", fontWeight: "600" }}
              >
                {project.mood}
              </span>
            </div>
          )}

          {project.style && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                backgroundColor: "#FFFDF9",
                borderRadius: "12px",
                border: "1px solid rgba(107, 58, 42, 0.08)",
              }}
            >
              <span
                style={{ fontSize: "0.85rem", color: "#6B3A2A", opacity: 0.6 }}
              >
                Style
              </span>
              <span
                style={{ fontSize: "0.95rem", color: "#2D1810", fontWeight: "600" }}
              >
                {project.style}
              </span>
            </div>
          )}

          {project.arrangement && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                backgroundColor: "#FFFDF9",
                borderRadius: "12px",
                border: "1px solid rgba(107, 58, 42, 0.08)",
              }}
            >
              <span
                style={{ fontSize: "0.85rem", color: "#6B3A2A", opacity: 0.6 }}
              >
                Arrangement
              </span>
              <span
                style={{ fontSize: "0.95rem", color: "#2D1810", fontWeight: "600" }}
              >
                {project.arrangement}
              </span>
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: "12px",
            border: "2px solid rgba(224, 90, 90, 0.2)",
            backgroundColor: "transparent",
            color: "#E05A5A",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            marginBottom: "3rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FEE2E2";
            e.currentTarget.style.borderColor = "#E05A5A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "rgba(224, 90, 90, 0.2)";
          }}
        >
          Delete This Idea
        </button>
      </div>
    </div>
  );
}