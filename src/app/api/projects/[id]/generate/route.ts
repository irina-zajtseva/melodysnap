import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import clientPromise from "@/lib/mongodb";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch project from DB (we need mood, style, arrangement)
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const project = await db.collection("projects").findOne(
      { id },
      { projection: { _id: 0, mood: 1, style: 1, arrangement: 1, title: 1 } }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 2. Build the prompt for Claude
    const prompt = `You are a warm, encouraging songwriting companion. A user has recorded a melody idea with these preferences:

- Title: "${project.title}"
- Mood: ${project.mood}
- Style: ${project.style}
- Arrangement: ${project.arrangement}

Based on these preferences, generate a complete song idea. Respond ONLY with valid JSON (no markdown, no backticks, no extra text) in this exact format:

{
  "chordProgression": {
    "key": "e.g. C major",
    "tempo": "e.g. 72 BPM — Slow and gentle",
    "chords": ["Am", "F", "C", "G"],
    "pattern": "A short description of how to play the chords, e.g. strum pattern or arpeggiation"
  },
  "songStructure": [
    {
      "section": "Intro",
      "chords": "Am - F",
      "bars": 4,
      "notes": "A tip for playing this section"
    },
    {
      "section": "Verse 1",
      "chords": "Am - F - C - G",
      "bars": 8,
      "notes": "A tip for this section"
    }
  ],
  "lyrics": {
    "verse1": "4-8 lines of lyrics for verse 1",
    "chorus": "4-6 lines for the chorus",
    "verse2": "4-8 lines of lyrics for verse 2",
    "bridge": "2-4 lines for the bridge (optional)"
  },
  "tips": [
    "A helpful musical tip",
    "Another tip about performance or feeling"
  ]
}

Make the lyrics match the mood (${project.mood}) and the style (${project.style}). Keep the chords appropriate for the arrangement (${project.arrangement}) — simpler for guitar, richer for piano, varied for soft band. Be creative and inspiring! The lyrics should feel personal and poetic, not generic.`;

    // 3. Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    // 4. Parse the response
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Clean any accidental markdown fences
    const cleanJson = textBlock.text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const songData = JSON.parse(cleanJson);

    // 5. Save to MongoDB
    await db.collection("projects").updateOne(
      { id },
      {
        $set: {
          songData,
          songGeneratedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // 6. Return the generated song
    return NextResponse.json({ songData });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate song ideas. Please try again." },
      { status: 500 }
    );
  }
}