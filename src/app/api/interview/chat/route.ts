import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Message } from "ai";
import { interviewers } from "@/lib/interviews";

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
      const interviewer = interviewers.find(
        (interviewer) => interviewer.id === id
      );
      return interviewer?.name || "Interviewer";
    };

    const interviewerName = getInterviewerName(voiceId);

    // 2. Get AI response using the chat route logic with context
    const { text: aiText } = await generateText({
      messages: updatedMessages,
      model: openai("gpt-4o-mini"),
      system: `
      You are ${interviewerName}, a professional interviewer conducting a ${type} interview for a ${jobRole} position.
      You are an expert in ${skills} and evaluating candidates with around ${experience} years of experience.
      
      Approach:
      - Be concise and direct in your responses as real interviewers are
      - Always introduce yourself by name at the beginning
      - Maintain a slightly strict, professional demeanor
      - Ask focused, challenging questions that truly test the candidate's expertise
      - Provide natural follow-up questions based on responses
      - Keep your responses conversational and human-like
      - Avoid using bullet points, markdown, or other formatting
      - If a candidate struggles, be firm but fair - offer minimal guidance only when necessary
      
      Your goal is to thoroughly evaluate if this candidate has the skills and experience necessary for the ${jobRole} position. Focus on practical scenarios they would face in this role.`,
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
          preset_voice: [voiceId],
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
