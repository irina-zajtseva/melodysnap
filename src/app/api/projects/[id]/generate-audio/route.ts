import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import clientPromise from "@/lib/mongodb";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch project from DB (we need audio + preferences)
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const project = await db.collection("projects").findOne(
      { id },
      {
        projection: {
          _id: 0,
          audioData: 1,
          audioType: 1,
          mood: 1,
          style: 1,
          arrangement: 1,
        },
      }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.audioData) {
      return NextResponse.json(
        { error: "No audio recording found" },
        { status: 400 }
      );
    }

    // 2. Convert base64 audio to a data URI that Replicate can accept
    const audioDataUri = `data:${project.audioType};base64,${project.audioData}`;

    // 3. Build the text prompt from user preferences
    // Build a precise prompt based on the mood mapping
    let musicPrompt = "";
    switch (project.mood) {
      case "Happy":
        musicPrompt = "uplifting pop song, acoustic guitar, bright and catchy, clean and accessible";
        break;
      case "Sad":
        musicPrompt = "slow emotional piano ballad, expressive piano, melancholic and reflective, no drums";
        break;
      case "Romantic":
        musicPrompt = "warm acoustic song, fingerpicked guitar, intimate and tender, gentle and organic";
        break;
      case "Epic":
        musicPrompt = "powerful orchestral arrangement, full band with drums and strings, cinematic and dramatic";
        break;
      case "Angry":
        musicPrompt = "intense rock song, full band with electric guitar and heavy drums, forceful and energetic";
        break;
      case "Dreamy":
        musicPrompt = "soft indie folk song, gentle band with acoustic instruments, nostalgic and floating, soft percussion";
        break;
      default:
        musicPrompt = "warm musical arrangement, high quality";
    }

    const prompt = `${musicPrompt}, follow the melody closely, high quality`;

    console.log("Generating audio with prompt:", prompt);

    // 4. Call MusicGen Melody via Replicate
    const output = await replicate.run("meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb", {
     input: {
        model_version: "stereo-melody-large",
        prompt: prompt,
        input_audio: audioDataUri,
        duration: 15,
        output_format: "wav",
        normalization_strategy: "loudness",
        classifier_free_guidance: 3,
        temperature: 1,
      },
    });


    // 5. output is a URL to the generated audio file — fetch it
    const audioUrl = String(output);
    console.log("Generated audio URL:", audioUrl);

    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error("Failed to download generated audio");
    }

    // 6. Convert to base64 and save to MongoDB
    const audioBuffer = await audioResponse.arrayBuffer();
    const generatedAudioBase64 = Buffer.from(audioBuffer).toString("base64");

    await db.collection("projects").updateOne(
      { id },
      {
        $set: {
          generatedAudio: generatedAudioBase64,
          generatedAudioType: "audio/wav",
          generatedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // 7. Return success
    return NextResponse.json({
      success: true,
      message: "Audio generated successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Generate audio error:", error.message);
    } else {
      console.error("Generate audio error:", error);
    }
    return NextResponse.json(
      { error: "Failed to generate audio. Please try again." },
      { status: 500 }
    );
  }
}