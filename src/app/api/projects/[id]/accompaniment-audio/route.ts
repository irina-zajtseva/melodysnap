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

    const project = await db.collection("projects").findOne(
      { id },
      { projection: { _id: 0, accompanimentAudio: 1, accompanimentAudioType: 1 } }
    );

    if (!project || !project.accompanimentAudio) {
      return NextResponse.json(
        { error: "No accompaniment audio found" },
        { status: 404 }
      );
    }

    const audioBuffer = Buffer.from(project.accompanimentAudio, "base64");

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": project.accompanimentAudioType || "audio/mp3",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Stream accompaniment error:", error);
    return NextResponse.json(
      { error: "Failed to stream audio" },
      { status: 500 }
    );
  }
}