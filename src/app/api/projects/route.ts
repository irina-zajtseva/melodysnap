// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth";

// POST — Create a new project
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const title = formData.get("title") as string || "Untitled Idea";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");

    const project = {
      id: nanoid(),
      userId: user.userId,
      title,
      audioData: base64Audio,
      audioType: audioFile.type,
      duration: Number(formData.get("duration")) || 0,
      mood: (formData.get("mood") as string) || "",
      style: (formData.get("style") as string) || "",
      arrangement: (formData.get("arrangement") as string) || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await db.collection("projects").insertOne(project);

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

// GET — Fetch only this user's projects
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const projects = await db
      .collection("projects")
      .find(
        { userId: user.userId },
        { projection: { audioData: 0, _id: 0 } }
      )
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