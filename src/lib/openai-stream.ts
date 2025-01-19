import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function streamGptText(prompt: string) {
  const startTime = Date.now();
  let firstByteReceivedTime: number | null = null;

  const response = streamText({
    messages: [{ role: "user", content: prompt }],
    model: openai("gpt-4o-mini"),
  });

  return {
    response,
    getChatGptTTFB: () =>
      firstByteReceivedTime ? firstByteReceivedTime - startTime : null,
  };
}
