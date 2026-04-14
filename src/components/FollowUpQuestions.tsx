// src/components/FollowUpQuestions.tsx
"use client";

import { useState } from "react";

type Preferences = {
  mood: string;
  style: string;
  arrangement: string;
};

type Props = {
  onComplete: (preferences: Preferences) => void;
  onBack: () => void;
};

const MOODS = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Dreamy", emoji: "🌙" },
  { label: "Energetic", emoji: "⚡" },
  { label: "Romantic", emoji: "💕" },
  { label: "Dramatic", emoji: "🎭" },
];

const STYLES = [
  { label: "Acoustic", emoji: "🎸" },
  { label: "Piano Ballad", emoji: "🎹" },
  { label: "Folk", emoji: "🪕" },
  { label: "Rock", emoji: "🎸" },
  { label: "Cinematic", emoji: "🎬" },
  { label: "Pop", emoji: "🎤" },
];

const ARRANGEMENTS = [
  { label: "Guitar", emoji: "🎸", description: "Simple guitar strumming" },
  { label: "Piano", emoji: "🎹", description: "Piano backing" },
  { label: "Soft Band", emoji: "🎵", description: "Gentle full arrangement" },
];

export default function FollowUpQuestions({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [style, setStyle] = useState("");
  const [arrangement, setArrangement] = useState("");

  const handleComplete = (selectedArrangement: string) => {
    onComplete({
      mood,
      style,
      arrangement: selectedArrangement,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      {/* Progress indicator */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: s <= step ? "#E07A5F" : "#E8D5C8",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Step 1: Mood */}
      {step === 1 && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#2D1810",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            What mood are you feeling?
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B3A2A",
              opacity: 0.6,
              marginBottom: "1.5rem",
            }}
          >
            This helps shape the musical direction
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => {
                  setMood(m.label);
                  setStep(2);
                }}
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "2px solid rgba(107, 58, 42, 0.1)",
                  backgroundColor: "#FFFDF9",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  color: "#2D1810",
                  fontFamily: "Georgia, serif",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E07A5F";
                  e.currentTarget.style.backgroundColor = "#FFF0E6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.1)";
                  e.currentTarget.style.backgroundColor = "#FFFDF9";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Style */}
      {step === 2 && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#2D1810",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            What style fits this idea?
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B3A2A",
              opacity: 0.6,
              marginBottom: "1.5rem",
            }}
          >
            You picked: {mood}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {STYLES.map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  setStyle(s.label);
                  setStep(3);
                }}
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "2px solid rgba(107, 58, 42, 0.1)",
                  backgroundColor: "#FFFDF9",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  color: "#2D1810",
                  fontFamily: "Georgia, serif",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E07A5F";
                  e.currentTarget.style.backgroundColor = "#FFF0E6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.1)";
                  e.currentTarget.style.backgroundColor = "#FFFDF9";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Arrangement */}
      {step === 3 && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#2D1810",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Choose an arrangement
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B3A2A",
              opacity: 0.6,
              marginBottom: "1.5rem",
            }}
          >
            {mood} · {style}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {ARRANGEMENTS.map((a) => (
              <button
                key={a.label}
                onClick={() => handleComplete(a.label)}
                style={{
                  padding: "1.25rem",
                  borderRadius: "12px",
                  border: "2px solid rgba(107, 58, 42, 0.1)",
                  backgroundColor: "#FFFDF9",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "Georgia, serif",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E07A5F";
                  e.currentTarget.style.backgroundColor = "#FFF0E6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.1)";
                  e.currentTarget.style.backgroundColor = "#FFFDF9";
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{a.emoji}</span>
                <div>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#2D1810",
                      margin: 0,
                    }}
                  >
                    {a.label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#6B3A2A",
                      opacity: 0.6,
                      margin: "0.25rem 0 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => {
          if (step > 1) setStep(step - 1);
          else onBack();
        }}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "transparent",
          color: "#6B3A2A",
          opacity: 0.6,
          cursor: "pointer",
          fontSize: "0.85rem",
          fontFamily: "Georgia, serif",
        }}
      >
        ← {step === 1 ? "Back to recording" : "Back"}
      </button>
    </div>
  );
}