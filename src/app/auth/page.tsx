"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
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

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Register-only validations
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
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* Logo */}
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
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
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
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
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

          {/* Name field (register only) */}
          {!isLogin && (
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.8rem",
                  color: "#6B3A2A",
                  opacity: 0.7,
                  marginBottom: "0.3rem",
                  display: "block",
                }}
              >
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
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#E07A5F";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)";
                }}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.8rem",
                color: "#6B3A2A",
                opacity: 0.7,
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
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
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#E07A5F";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.8rem",
                color: "#6B3A2A",
                opacity: 0.7,
                marginBottom: "0.3rem",
                display: "block",
              }}
            >
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
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#E07A5F";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(107, 58, 42, 0.12)";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
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
                onClick={() => {
                  setForgotMode(false);
                  setForgotMessage("");
                }}
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
            <p
              style={{
                color: "#C46A3A",
                textAlign: "center",
                marginBottom: "1rem",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.85rem",
              }}
            >
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