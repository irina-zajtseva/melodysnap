// src/components/ProjectList.tsx
"use client";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  duration: number;
  mood: string;
  style: string;
  arrangement: string;
  createdAt: string;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const playProject = (id: string) => {
    if (audio) {
      audio.pause();
    }

    if (playingId === id) {
      setPlayingId(null);
      setAudio(null);
      return;
    }

    const newAudio = new Audio(`/api/projects/${id}/audio`);
    newAudio.play();
    newAudio.onended = () => {
      setPlayingId(null);
      setAudio(null);
    };
    setPlayingId(id);
    setAudio(newAudio);
  };

  const deleteProject = async (id: string) => {
    // Stop audio if this project is playing
    if (playingId === id && audio) {
      audio.pause();
      setPlayingId(null);
      setAudio(null);
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state (no need to reload the page!)
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#E8985A", opacity: 0.7 }}>
        Loading your ideas...
      </p>
    );
  }

  if (projects.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#E8985A", opacity: 0.7 }}>
        Your saved ideas will appear here
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h2
        style={{
          fontSize: "1.1rem",
          color: "#2D1810",
          fontWeight: "600",
          marginBottom: "0.5rem",
        }}
      >
        Your Ideas
      </h2>

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            backgroundColor:
              playingId === project.id ? "#FFF0E6" : "#FFFDF9",
            borderRadius: "12px",
            border: "1px solid rgba(107, 58, 42, 0.1)",
            width: "100%",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 4px rgba(107, 58, 42, 0.06)",
          }}
        >
          {/* Play/Pause button */}
          <button
            onClick={() => playProject(project.id)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                playingId === project.id ? "#E07A5F" : "#FFF0E6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {playingId === project.id ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#E07A5F"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Project info */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                color: "#2D1810",
                margin: 0,
              }}
            >
              {project.title}
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#6B3A2A",
                opacity: 0.6,
                margin: "0.25rem 0 0 0",
              }}
            >
              {project.mood && `${project.mood} · `}
{project.style && `${project.style} · `}
{formatTime(project.duration)} ·{" "}
{formatDate(project.createdAt)}
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={() => deleteProject(project.id)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.4,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.backgroundColor = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.4";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            title="Delete idea"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E05A5A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}


