// src/components/RecordButton.tsx
"use client";

import { useState } from "react";

export default function RecordButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      {/* The main record button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: "4px solid var(--color-coral)",
          backgroundColor: isPressed
            ? "var(--color-rust)"
            : isHovered
            ? "var(--color-coral)"
            : "var(--color-warm-white)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          transition: "all 0.3s ease",
          boxShadow: isHovered
            ? "var(--shadow-record)"
            : "var(--shadow-soft)",
          transform: isPressed
            ? "scale(0.95)"
            : isHovered
            ? "scale(1.05)"
            : "scale(1)",
        }}
      >
        {/* Microphone icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHovered ? "white" : "var(--color-coral)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.3s ease" }}
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>

        <span
          style={{
            fontSize: "0.95rem",
            fontWeight: "600",
            color: isHovered ? "white" : "var(--color-coral)",
            transition: "color 0.3s ease",
            fontFamily: "Georgia, serif",
          }}
        >
          Record Idea
        </span>
      </button>

      {/* Helper text */}
      <p
        style={{
          marginTop: "1.5rem",
          fontSize: "0.85rem",
          color: "var(--color-brown)",
          opacity: 0.6,
        }}
      >
        Hum, sing, whistle, or play
      </p>
    </div>
  );
}