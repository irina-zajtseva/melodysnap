import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const POYO_QUERY_URL = "https://api.poyo.ai/uni/query";

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
          accompanimentGeneratedAt: 1,
        },
      }
    );

    if (!project || !project.accompanimentTaskId) {
      return NextResponse.json({ status: "none" });
    }

    // Already done — audio is saved
    if (project.accompanimentStatus === "finished") {
      return NextResponse.json({ status: "finished" });
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
    console.log("PoYo full response:", JSON.stringify(queryData.data));

    if (queryData.data?.status === "finished") {
      // Find the audio URL in the response
      const outputData = queryData.data.output || queryData.data;
      const audioUrl =
        outputData.audio_url ||
        outputData.url ||
        outputData.audio?.[0]?.url ||
        outputData.audio?.[0]?.audio_url ||
        (Array.isArray(outputData) ? outputData[0]?.audio_url : null);

      if (audioUrl) {
        // Download and save to MongoDB
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

      // Audio URL not found — log for debugging
      console.error("Could not find audio URL in:", JSON.stringify(queryData.data));
      return NextResponse.json({ status: "finished_no_audio" });
    }

    if (queryData.data?.status === "failed") {
      await db.collection("projects").updateOne(
        { id },
        { $set: { accompanimentStatus: "failed" } }
      );
      return NextResponse.json({ status: "failed" });
    }

    // Still processing
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