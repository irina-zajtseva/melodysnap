// src/app/api/projects/[id]/details/route.ts
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

    // Get project WITHOUT the heavy audio data
    const project = await db
      .collection("projects")
      .findOne({ id }, { projection: { audioData: 0, generatedAudio: 0, accompanimentAudio: 0, _id: 0 } });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}