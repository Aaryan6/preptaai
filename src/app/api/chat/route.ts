import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { messages, jobRole, skills, experience, type, voiceId } =
    await req.json();

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

  const { text } = await generateText({
    messages: messages,
    model: openai("gpt-4o-mini"),
    system: `
    You are a professional interviewer named ${interviewerName} conducting a ${type} interview.
    You are specializing in ${jobRole} roles with expertise in ${
      skills || "general technical skills"
    }.
    Your goal is to assess candidates for a ${jobRole} position, specifically looking for ${experience} years of experience.
    
    Interview Style:
    - Use a friendly but formal tone
    - Ask one focused question at a time
    - Ask relevant follow-up questions based on candidate responses
    - Adapt your questions based on the candidate's experience level (${experience} years)
    - If a candidate struggles, provide one helpful hint before moving on
    - Keep your responses concise and focused
    
    Start with a brief professional greeting introducing yourself as ${interviewerName}, then proceed with your first question.
    Focus your questions on real-world scenarios and problems related to ${jobRole} and ${
      skills || "the required technical skills"
    }.`,
  });

  return Response.json({ text });
}
