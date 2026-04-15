import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const POYO_API_URL = "https://api.poyo.ai/api/generate/submit";
const POYO_QUERY_URL = "https://api.poyo.ai/uni/query";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch project from DB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const project = await db.collection("projects").findOne(
      { id },
      { projection: { _id: 0, mood: 1, style: 1, arrangement: 1, title: 1 } }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 2. Build tags based on mood mapping
    let tags = "";
    let negativeTags = "";
    switch (project.mood) {
      case "Happy":
        tags = "uplifting pop, acoustic guitar, bright, catchy, cheerful";
        negativeTags = "heavy metal, sad, dark, aggressive";
        break;
      case "Sad":
        tags = "emotional piano ballad, slow, melancholic, reflective, expressive piano";
        negativeTags = "upbeat, fast drums, rock, aggressive";
        break;
      case "Romantic":
        tags = "warm acoustic, fingerpicked guitar, intimate, tender, gentle";
        negativeTags = "heavy drums, rock, aggressive, fast";
        break;
      case "Epic":
        tags = "orchestral, full band, cinematic, dramatic, powerful, strings, brass";
        negativeTags = "quiet, minimal, lo-fi";
        break;
      case "Angry":
        tags = "rock, full band, electric guitar, heavy drums, intense, forceful";
        negativeTags = "soft, gentle, quiet, piano ballad";
        break;
      case "Dreamy":
        tags = "indie folk, soft band, acoustic, nostalgic, floating, gentle percussion";
        negativeTags = "heavy metal, aggressive, loud drums";
        break;
      default:
        tags = "warm, musical, acoustic";
        negativeTags = "noise, harsh";
    }

    // 3. The public URL for the audio file (served from Vercel)
    const audioUrl = `https://melodysnap.vercel.app/api/projects/${id}/audio`;

    console.log("Submitting to PoYo:", { tags, negativeTags, audioUrl });

    // 4. Submit task to PoYo
    const submitResponse = await fetch(POYO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POYO_API_KEY}`,
      },
      body: JSON.stringify({
        model: "add-instrumental",
        input: {
          upload_url: audioUrl,
          title: project.title || "My Melody",
          tags: tags,
          negative_tags: negativeTags,
        },
      }),
    });

    const submitData = await submitResponse.json();
    console.log("PoYo submit response:", JSON.stringify(submitData));

    if (submitData.code !== 200) {
      throw new Error(`PoYo submit failed: ${JSON.stringify(submitData)}`);
    }

    const taskId = submitData.data.task_id;

    // 5. Poll for completion (max 3 minutes)
    let result = null;
    const maxAttempts = 36; // 36 * 5s = 3 minutes
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const queryResponse = await fetch(
        `${POYO_QUERY_URL}?task_id=${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.POYO_API_KEY}`,
          },
        }
      );

      const queryData = await queryResponse.json();
      console.log(`Poll ${i + 1}:`, queryData.data?.status);

      if (queryData.data?.status === "finished") {
        result = queryData.data;
        break;
      }

      if (queryData.data?.status === "failed") {
        throw new Error("PoYo generation failed");
      }
    }

    if (!result) {
      throw new Error("Generation timed out");
    }

    // 6. Get the audio URL from the result
    // PoYo returns audio URLs in the response
    const generatedUrl =
      result.output?.audio_url ||
      result.output?.url ||
      result.audio_url ||
      result.url;

    if (!generatedUrl) {
      console.log("Full PoYo result:", JSON.stringify(result));
      throw new Error("No audio URL in response");
    }

    // 7. Download the generated audio and save to MongoDB
    const audioResponse = await fetch(generatedUrl);
    if (!audioResponse.ok) {
      throw new Error("Failed to download generated audio");
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const generatedAudioBase64 = Buffer.from(audioBuffer).toString("base64");

    await db.collection("projects").updateOne(
      { id },
      {
        $set: {
          accompanimentAudio: generatedAudioBase64,
          accompanimentAudioType: "audio/mp3",
          accompanimentGeneratedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Accompaniment error:", error.message);
    } else {
      console.error("Accompaniment error:", error);
    }
    return NextResponse.json(
      { error: "Failed to generate accompaniment. Please try again." },
      { status: 500 }
    );
  }
}
