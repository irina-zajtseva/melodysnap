// src/components/FollowUpQuestions.tsx
"use client";

import { useState } from "react";

type Preferences = {
  title: string;
  mood: string;
  style: string;
  arrangement: string;
};

type Props = {
  onComplete: (preferences: Preferences) => void;
  onBack: () => void;
};

// 1-to-1-to-1 mapping from spec
const MOOD_MAP: Record<string, { emoji: string; style: string; arrangement: string; description: string }> = {
  Happy: {
    emoji: "😊",
    style: "Pop",
    arrangement: "Acoustic Guitar",
    description: "Bright pop with acoustic guitar",
  },
  Sad: {
    emoji: "😢",
    style: "Piano Ballad",
    arrangement: "Piano",
    description: "Emotional piano ballad",
  },
  Romantic: {
    emoji: "💕",
    style: "Acoustic",
    arrangement: "Fingerpicked Guitar",
    description: "Warm acoustic fingerpicking",
  },
  Epic: {
    emoji: "🔥",
    style: "Orchestral",
    arrangement: "Full Band",
    description: "Powerful orchestral full band",
  },
  Angry: {
    emoji: "😤",
    style: "Rock",
    arrangement: "Full Band",
    description: "Intense rock full band",
  },
  Dreamy: {
    emoji: "🌙",
    style: "Indie Folk",
    arrangement: "Soft Band",
    description: "Soft indie folk band",
  },
};

const MOODS = Object.keys(MOOD_MAP);

export default function FollowUpQuestions({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");

  const handleComplete = () => {
    const mapping = MOOD_MAP[mood];
    onComplete({
      title: title.trim() || `${mood} ${mapping.style} idea`,
      mood,
      style: mapping.style,
      arrangement: mapping.arrangement,
    });
  };

  const optionStyle = {
    padding: "1rem",
    borderRadius: "12px",
    border: "2px solid rgba(107, 58, 42, 0.1)",
    backgroundColor: "#FFFDF9",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#2D1810",
    fontFamily: "var(--font-heading)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const handleOptionHover = (e: React.MouseEvent, entering: boolean) => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = entering ? "#E07A5F" : "rgba(107, 58, 42, 0.1)";
    el.style.backgroundColor = entering ? "#FFF0E6" : "#FFFDF9";
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
      {/* Progress indicator — now just 2 steps */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[1, 2].map((s) => (
          <div
            key={s}
            style={{
              width: "48px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: s <= step ? "#E07A5F" : "#E8D5C8",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Step 1: Mood (auto-assigns style + arrangement) */}
      {step === 1 && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#2D1810",
              fontWeight: "600",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-heading)",
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
            This shapes everything — style, instruments, and feel
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMood(m);
                  setStep(2);
                }}
                style={{
                  ...optionStyle,
                  padding: "1.25rem",
                  textAlign: "left" as const,
                  justifyContent: "flex-start",
                }}
                onMouseEnter={(e) => handleOptionHover(e, true)}
                onMouseLeave={(e) => handleOptionHover(e, false)}
              >
                <span style={{ fontSize: "1.5rem" }}>{MOOD_MAP[m].emoji}</span>
                <div>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#2D1810",
                      margin: 0,
                    }}
                  >
                    {m}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#6B3A2A",
                      opacity: 0.6,
                      margin: "0.25rem 0 0 0",
                    }}
                  >
                    {MOOD_MAP[m].description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Name your idea */}
      {step === 2 && (
        <div style={{ textAlign: "center", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#2D1810",
              fontWeight: "600",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-heading)",
            }}
          >
            Name your idea
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B3A2A",
              opacity: 0.6,
              marginBottom: "1.5rem",
            }}
          >
            {MOOD_MAP[mood]?.emoji} {mood} · {MOOD_MAP[mood]?.style} · {MOOD_MAP[mood]?.arrangement}
          </p>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${mood} ${MOOD_MAP[mood]?.style} idea`}
            style={{
              width: "100%",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              border: "2px solid rgba(107, 58, 42, 0.15)",
              backgroundColor: "#FFFDF9",
              fontSize: "1rem",
              color: "#2D1810",
              fontFamily: "var(--font-body)",
              outline: "none",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#E07A5F";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.15)";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleComplete();
            }}
            autoFocus
          />

          <button
            onClick={handleComplete}
            style={{
              padding: "0.85rem 2rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#E07A5F",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "var(--font-heading)",
              width: "100%",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C46A3A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E07A5F";
            }}
          >
            Save My Idea ✨
          </button>
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
          fontFamily: "var(--font-body)",
        }}
      >
        ← {step === 1 ? "Back to recording" : "Back"}
      </button>
    </div>
  );
}