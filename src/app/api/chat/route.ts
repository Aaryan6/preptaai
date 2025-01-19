import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log({ messages });
  const response = streamText({
    model: openai("gpt-4o-mini"),
    messages: messages,
  });
  return response.toDataStreamResponse();
}
