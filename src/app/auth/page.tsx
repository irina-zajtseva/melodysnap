"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (name.trim().length < 2) {
        setError("Name must be at least 2 characters");
        return;
      }
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        setError("Password must include at least one uppercase letter and one number");
        return;
      }
    }

    setLoading(true);
    let result: string | null;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }
    setLoading(false);

    if (result) {
      setError(result);
    } else {
      router.push("/");
    }
  };

  const handleForgotPassword = async () => {
    setForgotMessage("");
    if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
      setForgotMessage("Please enter a valid email address");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMessage(data.message || data.error || "Check your email!");
    } catch {
      setForgotMessage("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        padding: "1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "2.2rem",
            fontWeight: "700",
            color: "#2D1810",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          MelodySnap
        </h1>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.95rem",
            color: "#E8985A",
            fontStyle: "italic",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          Capture a melody. Hear it become a song.
        </p>

        {/* Auth Card */}
        <div
          style={{
            backgroundColor: "#FFFDF9",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 30px rgba(107, 58, 42, 0.12)",
          }}
        >
          {/* Toggle Login / Register */}
          <div
            style={{
              display: "flex",
              gap: "0",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              overflow: "hidden",
              border: "2px solid rgba(107, 58, 42, 0.1)",
            }}
          >
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              style={{
                flex: 1,
                padding: "0.7rem",
                border: "none",
                backgroundColor: isLogin ? "#E07A5F" : "transparent",
                color: isLogin ? "#FFFDF9" : "#6B3A2A",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              style={{
                flex: 1,
                padding: "0.7rem",
                border: "none",
                backgroundColor: !isLogin ? "#E07A5F" : "transparent",
                color: !isLogin ? "#FFFDF9" : "#6B3A2A",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Create Account
            </button>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => { window.location.href = "/api/auth/google"; }}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "12px",
              border: "2px solid rgba(107, 58, 42, 0.12)",
              backgroundColor: "#FFFDF9",
              color: "#2D1810",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.2s ease",
              marginBottom: "0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#E07A5F";
              e.currentTarget.style.backgroundColor = "#FFF0E6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)";
              e.currentTarget.style.backgroundColor = "#FFFDF9";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(107, 58, 42, 0.1)" }} />
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem",
              color: "#6B3A2A",
              opacity: 0.5,
            }}>
              or
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(107, 58, 42, 0.1)" }} />
          </div>

          {/* Name field (register only) */}
          {!isLogin && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.8rem",
                color: "#6B3A2A",
                opacity: 0.7,
                marginBottom: "0.3rem",
                display: "block",
              }}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Irina"
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
          )}

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem",
              color: "#6B3A2A",
              opacity: 0.7,
              marginBottom: "0.3rem",
              display: "block",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem",
              color: "#6B3A2A",
              opacity: 0.7,
              marginBottom: "0.3rem",
              display: "block",
            }}>
              Password
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
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </div>

          {/* Forgot Password Link */}
          {isLogin && !forgotMode && (
            <button
              onClick={() => {
                setForgotMode(true);
                setForgotEmail(email);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#E07A5F",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                marginBottom: "1rem",
                display: "block",
                width: "100%",
                textAlign: "center",
              }}
            >
              Forgot your password?
            </button>
          )}

          {/* Forgot Password Form */}
          {forgotMode && (
            <div style={{
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "#FFF8F0",
              borderRadius: "10px",
            }}>
              <p style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.85rem",
                color: "#6B3A2A",
                marginBottom: "0.75rem",
                textAlign: "center",
              }}>
                Enter your email to receive a reset link
              </p>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "2px solid rgba(107, 58, 42, 0.12)",
                  backgroundColor: "#FFFDF9",
                  fontSize: "0.95rem",
                  color: "#2D1810",
                  fontFamily: "'Nunito', sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "0.75rem",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#E07A5F"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)"; }}
                onKeyDown={(e) => { if (e.key === "Enter") handleForgotPassword(); }}
              />
              <button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: forgotLoading ? "#D4A887" : "#E8985A",
                  color: "#FFFDF9",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: forgotLoading ? "not-allowed" : "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  marginBottom: "0.5rem",
                }}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
              {forgotMessage && (
                <p style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.8rem",
                  color: forgotMessage.includes("Check") || forgotMessage.includes("receive") ? "#6B8F71" : "#C46A3A",
                  textAlign: "center",
                  marginTop: "0.5rem",
                }}>
                  {forgotMessage}
                </p>
              )}
              <button
                onClick={() => { setForgotMode(false); setForgotMessage(""); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B3A2A",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  opacity: 0.6,
                  marginTop: "0.5rem",
                }}
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Error message */}
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

          {/* Submit button */}
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
              touchAction: "manipulation",
            }}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}