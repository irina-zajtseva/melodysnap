import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const POYO_API_URL = "https://api.poyo.ai/api/generate/submit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const project = await db.collection("projects").findOne(
      { id },
      { projection: { _id: 0, mood: 1, style: 1, arrangement: 1, title: 1 } }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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

    const audioUrl = `https://melodysnap.vercel.app/api/projects/${id}/audio`;

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

    // Save task_id to MongoDB — don't wait for completion
    await db.collection("projects").updateOne(
      { id },
      {
        $set: {
          accompanimentTaskId: submitData.data.task_id,
          accompanimentStatus: "processing",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      taskId: submitData.data.task_id,
      status: "processing",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Accompaniment error:", error.message);
    } else {
      console.error("Accompaniment error:", error);
    }
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}