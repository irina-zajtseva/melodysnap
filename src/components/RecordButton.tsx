// src/components/RecordButton.tsx
"use client";

import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export default function RecordButton() {
  const {
    status,
    audioURL,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* === IDLE STATE === */}
      {status === "idle" && (
        <>
          <button
            onClick={startRecording}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: "4px solid #E07A5F",
              backgroundColor: "#FFFDF9",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 20px rgba(107, 58, 42, 0.15)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E07A5F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
                color: "#E07A5F",
                fontFamily: "Georgia, serif",
              }}
            >
              Record Idea
            </span>
          </button>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.85rem",
              color: "#6B3A2A",
              opacity: 0.6,
            }}
          >
            Hum, sing, whistle, or play
          </p>
        </>
      )}

      {/* === RECORDING STATE === */}
      {status === "recording" && (
        <>
          <button
            onClick={stopRecording}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: "4px solid #E05A5A",
              backgroundColor: "#E05A5A",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="white"
              stroke="none"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                color: "white",
                fontFamily: "Georgia, serif",
              }}
            >
              {formatTime(duration)}
            </span>
          </button>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.85rem",
              color: "#E05A5A",
              fontWeight: "500",
            }}
          >
            Recording... tap to stop
          </p>
        </>
      )}

      {/* === RECORDED STATE === */}
      {status === "recorded" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFDF9",
              borderRadius: "16px",
              padding: "1.5rem 2rem",
              boxShadow: "0 4px 30px rgba(107, 58, 42, 0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                color: "#2D1810",
                fontWeight: "600",
              }}
            >
              Your idea ({formatTime(duration)})
            </p>
            <audio
              controls
              src={audioURL || undefined}
              style={{ width: "280px", height: "40px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={resetRecording}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "2px solid #E07A5F",
                backgroundColor: "transparent",
                color: "#E07A5F",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              Try Again
            </button>
            <button
              onClick={async () => {
              if (!audioBlob) return;

              const formData = new FormData();
              formData.append("audio", audioBlob, "recording.webm");
              formData.append("title", "Untitled Idea");
              formData.append("duration", duration.toString());

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Idea saved! ✨");
        resetRecording();
        // Reload to show in project list
        window.location.reload();
      } else {
        alert("Failed to save. Try again!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save. Try again!");
    }
  }}
  style={{
    padding: "0.75rem 1.5rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#E07A5F",
    color: "white",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  }}
>
  Keep This Idea
</button>
          </div>
        </div>
      )}
    </div>
  );
}