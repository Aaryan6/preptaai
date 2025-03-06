import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check for required environment variables
if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

export async function POST(req: Request) {
  const user = await currentUser();
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      throw new Error("No audio file provided");
    }

    // 1. Convert audio to text using Groq Whisper API
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Create a File object from the Buffer
    const audioFileObj = new File([audioBuffer], "audio.mp3", {
      type: "audio/webm",
    });

    // Create and populate FormData for Groq API
    const groqFormData = new FormData();
    groqFormData.append("file", audioFileObj);
    groqFormData.append("model", "whisper-large-v3-turbo");
    groqFormData.append("response_format", "json");
    groqFormData.append("language", "en");
    groqFormData.append("temperature", "0");

    // Call Groq API for transcription
    const transcriptionResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqFormData,
      }
    );

    if (!transcriptionResponse.ok) {
      const errorData = await transcriptionResponse.json();
      throw new Error(
        `Groq Whisper API error: ${
          errorData.error?.message || transcriptionResponse.statusText
        }`
      );
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcribedText = transcriptionData.text || "";

    // Return both the transcripts and audio response
    return NextResponse.json({ transcribedText });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process voice input" },
      { status: 500 }
    );
  }
}
