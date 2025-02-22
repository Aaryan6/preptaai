import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Message } from "ai";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;
    const messagesJson = formData.get("messages") as string;
    const messages: Message[] = messagesJson ? JSON.parse(messagesJson) : [];

    // Get interview settings from formData
    const jobRole = (formData.get("jobRole") as string) || "Software Engineer";
    const skills =
      (formData.get("skills") as string) || "general technical skills";
    const experience = (formData.get("experience") as string) || "3";
    const type = (formData.get("type") as string) || "technical";
    const voiceId = (formData.get("voiceId") as string) || "aura-orpheus-en";

    if (!audioFile) {
      throw new Error("No audio file provided");
    }

    // 1. Convert audio to text using Deepgram
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const transcriptionResponse =
      await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
        smart_format: true,
        model: "nova-2",
        mimetype: "audio/webm",
      });

    const transcribedText =
      transcriptionResponse.result?.results?.channels[0]?.alternatives[0]
        ?.transcript || "";

    // Add the new user message to the context
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: transcribedText, id: Date.now().toString() },
    ];

    // Get interviewer name based on voiceId
    const getInterviewerName = (id: string) => {
      switch (id) {
        case "aura-orpheus-en":
          return "Orpheus";
        case "aura-orion-en":
          return "Orion";
        case "aura-luna-en":
          return "Luna";
        default:
          return "Orpheus";
      }
    };

    const interviewerName = getInterviewerName(voiceId);

    // 2. Get AI response using the chat route logic with context
    const { text: aiText } = await generateText({
      messages: updatedMessages,
      model: openai("gpt-4"),
      system: `
      You are a professional interviewer named ${interviewerName} conducting a ${type} interview.
      You are specializing in ${jobRole} roles with expertise in ${skills}.
      Your goal is to assess candidates for a ${jobRole} position, specifically looking for ${experience} years of experience.
      
      Interview Style:
      - Use a friendly but formal tone
      - Ask one focused question at a time
      - Ask relevant follow-up questions based on candidate responses
      - Adapt your questions based on the candidate's experience level (${experience} years)
      - If a candidate struggles, provide one helpful hint before moving on
      - Keep your responses concise and focused
      
      Start with a brief professional greeting introducing yourself as ${interviewerName}, then proceed with your first question.
      Focus your questions on real-world scenarios and problems related to ${jobRole} and ${skills}.`,
    });

    // 3. Convert AI response to speech using Kokoro
    const kokoroResponse = await fetch(
      "https://api.deepinfra.com/v1/inference/hexgrad/Kokoro-82M",
      {
        method: "POST",
        headers: {
          Authorization: `bearer ${process.env.DEEPINFRA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: aiText,
          output_format: "wav",
          preset_voice: ["af_bella"],
        }),
      }
    );

    if (!kokoroResponse.ok) {
      throw new Error(
        `Failed to generate speech: ${await kokoroResponse.text()}`
      );
    }

    const kokoroData = await kokoroResponse.json();

    // Return both the transcripts and audio response
    return NextResponse.json({
      audio: kokoroData.audio,
      transcribedText,
      aiText,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process voice input" },
      { status: 500 }
    );
  }
}
