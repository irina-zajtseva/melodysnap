"use client";

import { useState } from "react";

interface SongData {
  chordProgression: {
    key: string;
    tempo: string;
    chords: string[];
    pattern: string;
  };
  songStructure: {
    section: string;
    chords: string;
    bars: number;
    notes: string;
  }[];
  lyrics: {
    verse1: string;
    chorus: string;
    verse2: string;
    bridge?: string;
  };
  tips: string[];
}

interface SongDisplayProps {
  projectId: string;
  initialSongData: SongData | null;
}

export default function SongDisplay({ projectId, initialSongData }: SongDisplayProps) {
  const [songData, setSongData] = useState<SongData | null>(initialSongData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Generation failed");
      }
      const data = await res.json();
      setSongData(data.songData);
    } catch {
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "32px" }}>
      {/* Generate / Regenerate Button */}
      <button
        onClick={generate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px 24px",
          backgroundColor: loading ? "#D4A887" : "#E07A5F",
          color: "#FFFDF9",
          border: "none",
          borderRadius: "16px",
          fontSize: "17px",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
          touchAction: "manipulation",
        }}
      >
        {loading
          ? "✨ Creating your song..."
          : songData
          ? "🔄 Regenerate Song Ideas"
          : "✨ Generate Song Ideas"}
      </button>

      {error && (
        <p style={{ color: "#C46A3A", textAlign: "center", marginTop: "12px", fontFamily: "'Nunito', sans-serif" }}>
          {error}
        </p>
      )}

      {/* Song Content */}
      {songData && (
        <div style={{ marginTop: "24px" }}>
          {/* Chord Progression Card */}
          <div style={{
            backgroundColor: "#FFFDF9",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid #F0E6DA",
          }}>
            <h3 style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "18px",
              color: "#2D1810",
              marginBottom: "12px",
            }}>
              🎵 Chord Progression
            </h3>
            <div style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "12px",
            }}>
              {songData.chordProgression.chords.map((chord, i) => (
                <span key={i} style={{
                  backgroundColor: "#FFF0E6",
                  color: "#6B3A2A",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                }}>
                  {chord}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B3A2A", fontSize: "14px", margin: "4px 0" }}>
              <strong>Key:</strong> {songData.chordProgression.key}
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B3A2A", fontSize: "14px", margin: "4px 0" }}>
              <strong>Tempo:</strong> {songData.chordProgression.tempo}
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#6B3A2A", fontSize: "14px", margin: "4px 0" }}>
              <strong>Pattern:</strong> {songData.chordProgression.pattern}
            </p>
          </div>

          {/* Song Structure Card */}
          <div style={{
            backgroundColor: "#FFFDF9",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid #F0E6DA",
          }}>
            <h3 style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "18px",
              color: "#2D1810",
              marginBottom: "12px",
            }}>
              🏗️ Song Structure
            </h3>
            {songData.songStructure.map((section, i) => (
              <div key={i} style={{
                padding: "12px",
                backgroundColor: i % 2 === 0 ? "#FFF8F0" : "transparent",
                borderRadius: "8px",
                marginBottom: "4px",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    color: "#2D1810",
                    fontSize: "15px",
                  }}>
                    {section.section}
                  </span>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "#E07A5F",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}>
                    {section.chords}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "#6B3A2A",
                  fontSize: "13px",
                  margin: 0,
                  fontStyle: "italic",
                }}>
                  {section.notes} · {section.bars} bars
                </p>
              </div>
            ))}
          </div>

          {/* Lyrics Card */}
          <div style={{
            backgroundColor: "#FFFDF9",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid #F0E6DA",
          }}>
            <h3 style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "18px",
              color: "#2D1810",
              marginBottom: "16px",
            }}>
              ✍️ Lyrics
            </h3>
            {Object.entries(songData.lyrics).map(([sectionName, text]) => (
              <div key={sectionName} style={{ marginBottom: "16px" }}>
                <p style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#E07A5F",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}>
                  {sectionName.replace(/(\d)/, " $1")}
                </p>
                <p style={{
                  fontFamily: "'Libre Baskerville', serif",
                  color: "#2D1810",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Tips Card */}
          <div style={{
            backgroundColor: "#FFFDF9",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid #F0E6DA",
          }}>
            <h3 style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "18px",
              color: "#2D1810",
              marginBottom: "12px",
            }}>
              💡 Tips
            </h3>
            {songData.tips.map((tip, i) => (
              <p key={i} style={{
                fontFamily: "'Nunito', sans-serif",
                color: "#6B3A2A",
                fontSize: "14px",
                lineHeight: 1.6,
                margin: "0 0 8px 0",
                paddingLeft: "12px",
                borderLeft: "3px solid #E8985A",
              }}>
                {tip}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}