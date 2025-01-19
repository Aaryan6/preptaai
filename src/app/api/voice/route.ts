import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { init, stream } from "playht";
import { Writable } from "stream";

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

export async function POST(req: Request) {
  init({
    apiKey: process.env.NEXT_PUBLIC_PLAYHT_API_KEY!,
    userId: process.env.NEXT_PUBLIC_PLAYHT_USER_ID!,
  });

  try {
    const { prompt } = await req.json();
    const signal = req.signal; // Get the abort signal from the request

    // Get the GPT stream
    const textStream = await streamGptText(prompt);

    // Configure PlayHT stream
    const playHTStream = await stream(textStream, {
      voiceId:
        "s3://voice-cloning-zero-shot/801a663f-efd0-4254-98d0-5c175514c3e8/jennifer/manifest.json",
      voiceEngine: "Play3.0-mini",
      outputFormat: "mp3",
    });

    // Create a transform stream for the response
    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk, encoding, callback) {
        // Check if request has been aborted
        if (signal?.aborted) {
          callback(new Error("Request aborted"));
          return;
        }
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    return new Promise((resolve, reject) => {
      // Handle abort signal
      signal?.addEventListener("abort", () => {
        reject(new Error("Request aborted"));
      });

      playHTStream.pipe(writable);

      writable.on("finish", () => {
        const buffer = Buffer.concat(chunks);
        resolve(
          new Response(buffer, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
          })
        );
      });

      writable.on("error", (err) => {
        if (err.message === "Request aborted") {
          reject(new Error("Request aborted"));
        } else {
          reject(
            NextResponse.json(
              { success: false, error: "Failed to process voice input" },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process voice input" },
      { status: 500 }
    );
  }
}
