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

// Mood → Style mapping (automatic)
const MOOD_STYLES: Record<string, string> = {
  Happy: "Pop",
  Sad: "Piano Ballad",
  Romantic: "Acoustic",
  Epic: "Orchestral",
  Angry: "Rock",
  Dreamy: "Indie Folk",
};

// Mood → Available arrangements
const MOOD_ARRANGEMENTS: Record<string, { label: string; emoji: string; tags: string }[]> = {
  Happy: [
    { label: "Acoustic Guitar Pop", emoji: "🎸", tags: "acoustic guitar, pop, bright, catchy" },
    { label: "Ukulele & Claps", emoji: "🪕", tags: "ukulele, claps, cheerful, sunny, light percussion" },
    { label: "Piano Pop", emoji: "🎹", tags: "piano, pop, upbeat, bright, playful" },
    { label: "Surprise Me", emoji: "🎲", tags: "RANDOM" },
  ],
  Sad: [
    { label: "Solo Piano", emoji: "🎹", tags: "solo piano, slow, emotional, melancholic, no drums" },
    { label: "Acoustic Guitar Ballad", emoji: "🎸", tags: "acoustic guitar, slow ballad, gentle, reflective" },
    { label: "Strings & Cello", emoji: "🎻", tags: "strings, cello, orchestral, emotional, cinematic" },
    { label: "Surprise Me", emoji: "🎲", tags: "RANDOM" },
  ],
  Romantic: [
    { label: "Fingerpicked Guitar", emoji: "🎸", tags: "fingerpicked guitar, warm, intimate, tender, gentle" },
    { label: "Piano & Strings", emoji: "🎹", tags: "piano, strings, romantic, warm, expressive" },
    { label: "Jazz Guitar", emoji: "🎷", tags: "jazz guitar, smooth, warm, intimate, soft drums" },
    { label: "Surprise Me", emoji: "🎲", tags: "RANDOM" },
  ],
  Epic: [
    { label: "Full Orchestra", emoji: "🎻", tags: "full orchestra, strings, brass, timpani, cinematic, powerful" },
    { label: "Rock Band", emoji: "🎸", tags: "rock band, electric guitar, drums, bass, powerful, driving" },
    { label: "Cinematic Strings", emoji: "🎬", tags: "cinematic strings, dramatic, building, epic percussion" },
    { label: "Surprise Me", emoji: "🎲", tags: "RANDOM" },
  ],
  Angry: [
    { label: "Electric Guitar Rock", emoji: "🎸", tags: "electric guitar, rock, distortion, aggressive, heavy" },
    { label: "Heavy Drums & Bass", emoji: "🥁", tags: "heavy drums, bass, intense, dark, pounding rhythm" },
    { label: "Punk Band", emoji: "⚡", tags: "punk rock, fast, raw, energetic, loud guitar" },
    { label: "Surprise Me", emoji: "🎲", tags: "RANDOM" },
  ],
  Dreamy: [
    { label: "Lo-fi Acoustic", emoji: "🌙", tags: "lo-fi, acoustic guitar, mellow, warm, soft, dreamy" },
    { label: "Ambient Piano", emoji: "🎹", tags: "ambient piano, ethereal, floating, reverb, gentle" },
    { label: "Indie Folk Band", emoji: "🪕", tags: "indie folk, acoustic, gentle percussion, mandolin, warm" },
    { label: "Surprise Me", emoji: "🎲", tags: "RANDOM" },
  ],
};

// Random tags pool per mood for "Surprise Me"
const SURPRISE_TAGS: Record<string, string[]> = {
  Happy: [
    "tropical, marimba, steel drums, sunny, island vibes",
    "whistling, acoustic guitar, handclaps, feel-good, bouncy",
    "synth pop, electronic, bright, fun, danceable",
    "brass, funk, groovy, upbeat, rhythmic",
  ],
  Sad: [
    "ambient, reverb, minimal piano, spacious, haunting",
    "folk, acoustic, gentle vocals, mournful, storytelling",
    "rain sounds, soft synth, melancholic, atmospheric",
    "harp, gentle strings, classical, sorrowful, delicate",
  ],
  Romantic: [
    "bossa nova, nylon guitar, smooth, tropical, warm evening",
    "soft synth, ambient, dreamy, ethereal, tender",
    "violin, classical, passionate, sweeping, elegant",
    "R&B, smooth, soulful, warm bass, intimate",
  ],
  Epic: [
    "choir, orchestral, massive, triumphant, heroic",
    "electronic, synth, futuristic, powerful, building",
    "taiko drums, world music, intense, ceremonial, grand",
    "metal, double bass drums, shredding guitar, fierce",
  ],
  Angry: [
    "industrial, electronic, dark, mechanical, aggressive",
    "thrash metal, fast drums, heavy riffs, chaotic",
    "hip hop beat, dark bass, gritty, urban, intense",
    "grunge, dirty guitar, raw, unpolished, powerful",
  ],
  Dreamy: [
    "chillwave, synth pads, retro, nostalgic, hazy",
    "celtic, harp, flute, mystical, enchanting",
    "jazz, brushed drums, double bass, smoky, late night",
    "music box, gentle bells, lullaby, innocent, magical",
  ],
};

const MOODS = Object.keys(MOOD_STYLES);

const MOOD_INFO: Record<string, { emoji: string; description: string }> = {
  Happy: { emoji: "😊", description: "Bright and uplifting" },
  Sad: { emoji: "😢", description: "Emotional and reflective" },
  Romantic: { emoji: "💕", description: "Warm and intimate" },
  Epic: { emoji: "🔥", description: "Powerful and dramatic" },
  Angry: { emoji: "😤", description: "Intense and forceful" },
  Dreamy: { emoji: "🌙", description: "Soft and nostalgic" },
};

export default function FollowUpQuestions({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [arrangement, setArrangement] = useState("");
  const [arrangementTags, setArrangementTags] = useState("");
  const [title, setTitle] = useState("");

  const handleComplete = () => {
    const style = MOOD_STYLES[mood];

    // Handle "Surprise Me" — pick random tags
    let finalTags = arrangementTags;
    if (finalTags === "RANDOM") {
      const options = SURPRISE_TAGS[mood];
      finalTags = options[Math.floor(Math.random() * options.length)];
    }

    onComplete({
      title: title.trim() || `${mood} ${arrangement} idea`,
      mood,
      style,
      arrangement: `${arrangement}|${finalTags}`,
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
      {/* Progress indicator — 3 steps */}
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
            This shapes the musical direction
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
                <span style={{ fontSize: "1.5rem" }}>{MOOD_INFO[m].emoji}</span>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#2D1810", margin: 0 }}>
                    {m}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#6B3A2A", opacity: 0.6, margin: "0.25rem 0 0 0" }}>
                    {MOOD_INFO[m].description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Arrangement */}
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
            Choose your sound
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B3A2A",
              opacity: 0.6,
              marginBottom: "1.5rem",
            }}
          >
            {MOOD_INFO[mood]?.emoji} {mood} · {MOOD_STYLES[mood]}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {MOOD_ARRANGEMENTS[mood]?.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  setArrangement(a.label);
                  setArrangementTags(a.tags);
                  setStep(3);
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
                <span style={{ fontSize: "1.5rem" }}>{a.emoji}</span>
                <p style={{ fontSize: "1rem", fontWeight: "600", color: "#2D1810", margin: 0 }}>
                  {a.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Name your idea */}
      {step === 3 && (
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
            {MOOD_INFO[mood]?.emoji} {mood} · {arrangement}
          </p>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${mood} ${arrangement} idea`}
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
            onFocus={(e) => { e.currentTarget.style.borderColor = "#E07A5F"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.15)"; }}
            onKeyDown={(e) => { if (e.key === "Enter") handleComplete(); }}
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
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C46A3A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#E07A5F"; }}
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