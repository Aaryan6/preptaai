import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const cookieStore = await cookies();
  const interviewContext = JSON.parse(
    cookieStore.get("interview-context")?.value || "{}"
  );

  const { text } = await generateText({
    messages: messages,
    model: openai("gpt-4o-mini"),
    system: `
    You are a professional interviewer named Emily specializing in ${interviewContext.skills} roles. 
    Your goal is to simulate a real-world interview for a ${interviewContext.role} position. 
    Use a friendly but formal tone, ask follow-up questions, and adapt to the candidate's answers. 
    Start with a greeting, then ask 1 question at a time. 
    If the candidate struggles, offer a hint (but only once per question).`,
  });

  return Response.json({ text });
}
