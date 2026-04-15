import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const POYO_QUERY_URL = "https://api.poyo.ai/api/generate/detail/music";

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
      {
        projection: {
          _id: 0,
          accompanimentTaskId: 1,
          accompanimentStatus: 1,
        },
      }
    );

    if (!project || !project.accompanimentTaskId) {
      return NextResponse.json({ status: "none" });
    }

    if (project.accompanimentStatus === "finished") {
      return NextResponse.json({ status: "finished" });
    }

    if (project.accompanimentStatus === "failed") {
      return NextResponse.json({ status: "failed" });
    }

    // Check PoYo status
    const queryResponse = await fetch(
      `${POYO_QUERY_URL}?task_id=${project.accompanimentTaskId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.POYO_API_KEY}`,
        },
      }
    );

    const queryData = await queryResponse.json();
    console.log("PoYo status:", queryData.data?.status);

    if (queryData.data?.status === "finished") {
      // Get audio URL from files array
      const files = queryData.data.files;
      const audioUrl = files?.[0]?.audio_url;

      if (audioUrl) {
        const audioResponse = await fetch(audioUrl);
        if (audioResponse.ok) {
          const audioBuffer = await audioResponse.arrayBuffer();
          const base64 = Buffer.from(audioBuffer).toString("base64");

          await db.collection("projects").updateOne(
            { id },
            {
              $set: {
                accompanimentAudio: base64,
                accompanimentAudioType: "audio/mp3",
                accompanimentStatus: "finished",
                accompanimentGeneratedAt: new Date(),
                updatedAt: new Date(),
              },
            }
          );

          return NextResponse.json({ status: "finished" });
        }
      }

      console.error("No audio URL in files:", JSON.stringify(queryData.data.files));
      return NextResponse.json({ status: "finished_no_audio" });
    }

    if (queryData.data?.status === "failed") {
      await db.collection("projects").updateOne(
        { id },
        { $set: { accompanimentStatus: "failed" } }
      );
      return NextResponse.json({ status: "failed" });
    }

    return NextResponse.json({ status: "processing" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Status check error:", error.message);
    } else {
      console.error("Status check error:", error);
    }
    return NextResponse.json({ status: "error" });
  }
}