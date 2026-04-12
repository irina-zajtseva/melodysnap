// src/app/api/projects/[id]/audio/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const project = await db
      .collection("projects")
      .findOne({ id }, { projection: { audioData: 1, audioType: 1 } });

    if (!project || !project.audioData) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Convert base64 back to binary and send as audio
    const audioBuffer = Buffer.from(project.audioData, "base64");

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": project.audioType || "audio/webm",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to fetch audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}