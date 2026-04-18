import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      name: string;
    };

    return NextResponse.json({
      user: {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}