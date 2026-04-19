"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!password) {
      setError("Please enter a new password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must include at least one uppercase letter and one number");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "400px",
        }}>
          <p style={{ color: "#C46A3A", fontFamily: "'Nunito', sans-serif", marginBottom: "1rem" }}>
            Invalid reset link. Please request a new one.
          </p>
          <button
            onClick={() => router.push("/auth")}
            style={{
              padding: "0.7rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#E07A5F",
              color: "#FFFDF9",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "400px",
          backgroundColor: "#FFFDF9",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 30px rgba(107, 58, 42, 0.12)",
        }}>
          <p style={{
            fontSize: "2rem",
            marginBottom: "1rem",
          }}>
            🎵
          </p>
          <h2 style={{
            fontFamily: "'Libre Baskerville', serif",
            color: "#2D1810",
            marginBottom: "0.5rem",
          }}>
            Password Updated!
          </h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            color: "#6B3A2A",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}>
            You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push("/auth")}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#E07A5F",
              color: "#FFFDF9",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: "2.2rem",
          fontWeight: "700",
          color: "#2D1810",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}>
          MelodySnap
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "0.95rem",
          color: "#E8985A",
          fontStyle: "italic",
          textAlign: "center",
          marginBottom: "2.5rem",
        }}>
          Choose a new password
        </p>

        <div style={{
          backgroundColor: "#FFFDF9",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 30px rgba(107, 58, 42, 0.12)",
        }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem",
              color: "#6B3A2A",
              opacity: 0.7,
              marginBottom: "0.3rem",
              display: "block",
            }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "2px solid rgba(107, 58, 42, 0.12)",
                backgroundColor: "#FFF8F0",
                fontSize: "1rem",
                color: "#2D1810",
                fontFamily: "'Nunito', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#E07A5F"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)"; }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem",
              color: "#6B3A2A",
              opacity: 0.7,
              marginBottom: "0.3rem",
              display: "block",
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type your password again"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "2px solid rgba(107, 58, 42, 0.12)",
                backgroundColor: "#FFF8F0",
                fontSize: "1rem",
                color: "#2D1810",
                fontFamily: "'Nunito', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#E07A5F"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)"; }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </div>

          {error && (
            <p style={{
              color: "#C46A3A",
              textAlign: "center",
              marginBottom: "1rem",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.85rem",
            }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: loading ? "#D4A887" : "#E07A5F",
              color: "#FFFDF9",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{ color: "#E8985A" }}>Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}