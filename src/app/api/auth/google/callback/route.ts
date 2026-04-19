import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/auth?error=no_code", request.url));
    }

    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://melodysnap.vercel.app"
      : "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Google token error:", tokenData);
      return NextResponse.redirect(new URL("/auth?error=token_failed", request.url));
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/auth?error=no_email", request.url));
    }

    // Find or create user in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    let user = await db.collection("users").findOne({ email: googleUser.email });

    if (!user) {
      // Create new user (no password since they use Google)
      const result = await db.collection("users").insertOne({
        name: googleUser.name || "User",
        email: googleUser.email,
        googleId: googleUser.id,
        avatar: googleUser.picture,
        createdAt: new Date(),
      });
      user = {
        _id: result.insertedId,
        name: googleUser.name || "User",
        email: googleUser.email,
      };
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Set cookie and redirect to home
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.redirect(new URL("/auth?error=server_error", request.url));
  }
}