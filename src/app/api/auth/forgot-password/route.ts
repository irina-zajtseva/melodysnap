import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Please enter your email" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db.collection("users").findOne({ email });

    // Always return success even if user not found (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a reset link.",
      });
    }

    // Create a reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Build reset URL
    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://melodysnap.vercel.app"
      : "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    // Send email
    await resend.emails.send({
      from: "MelodySnap <onboarding@resend.dev>",
      to: email,
      subject: "Reset your MelodySnap password 🎵",
      html: `
        <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem; background-color: #FFF8F0; border-radius: 16px;">
          <h1 style="font-family: 'Libre Baskerville', Georgia, serif; color: #2D1810; text-align: center; font-size: 1.8rem;">
            MelodySnap
          </h1>
          <p style="color: #E8985A; text-align: center; font-style: italic; margin-bottom: 2rem;">
            Capture a melody. Hear it become a song.
          </p>
          <p style="color: #2D1810; font-size: 1rem; line-height: 1.6;">
            Hi ${user.name},
          </p>
          <p style="color: #6B3A2A; font-size: 0.95rem; line-height: 1.6;">
            You requested a password reset. Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${resetUrl}" style="background-color: #E07A5F; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1rem; display: inline-block;">
              Reset My Password
            </a>
          </div>
          <p style="color: #6B3A2A; font-size: 0.8rem; opacity: 0.6; text-align: center;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}