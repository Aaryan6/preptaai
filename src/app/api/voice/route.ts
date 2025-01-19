import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

async function streamGptText(prompt: string) {
  const { textStream } = streamText({
    messages: [{ role: "user", content: prompt }],
    model: openai("gpt-4o-mini"),
  });

  // Convert AsyncIterableStream to string
  let fullText = "";
  for await (const chunk of textStream) {
    fullText += chunk;
  }
  return fullText;
}

async function getAudioBuffer(response: ReadableStream) {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Get the GPT stream
    const textStream = await streamGptText(prompt);

    // Generate audio using Deepgram
    const response = await deepgram.speak.request(
      { text: textStream },
      {
        model: "aura-athena-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();

    if (!stream) {
      throw new Error("Failed to generate audio stream");
    }

    const buffer = await getAudioBuffer(stream);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process voice input" },
      { status: 500 }
    );
  }
}
