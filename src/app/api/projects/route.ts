// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { nanoid } from "nanoid";

// POST — Create a new project
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const title = formData.get("title") as string || "Untitled Idea";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert the audio file to a base64 string for storage
    // (For MVP this is simple. Later we'd use cloud storage like S3)
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");

    // Create the project document
    const project = {
      id: nanoid(),
      title,
      audioData: base64Audio,
      audioType: audioFile.type,
      duration: Number(formData.get("duration")) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await db.collection("projects").insertOne(project);

    // Return the project (without the heavy audio data)
    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        duration: project.duration,
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to save project:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}

// GET — Fetch all projects
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Get all projects, newest first, but don't send the audio data
    const projects = await db
      .collection("projects")
      .find({}, { projection: { audioData: 0, _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}