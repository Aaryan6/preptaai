import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { extractTextFromPDF } from "@/utils/file-extractors";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const numberOfBios = parseInt(formData.get("numberOfBios") as string);
    const customPrompt = formData.get("prompt") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tmpdir(), `resume-${Date.now()}.pdf`);
    await writeFile(tempPath, buffer);

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(tempPath);

    // Generate LinkedIn bio using Gemini
    const prompt = `
${customPrompt}

---

Resume Content:
${resumeText}

---
Generate ${numberOfBios} different bios.`;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      prompt,
      schema: z
        .array(
          z.object({
            headline: z.string(),
            bio: z.string(),
          })
        )
        .length(numberOfBios || 1),
      output: "object",
      system: systemPrompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error generating bio:", error);
    return NextResponse.json(
      { error: "Failed to generate bio" },
      { status: 500 }
    );
  }
}

const systemPrompt = `
You are a LinkedIn profile bio and headline generator. Your goal is to create compelling and professional LinkedIn content based on user-provided information.

**Instructions:**

1. **Headline Generation:**
    - Write a concise and impactful LinkedIn headline (under 100 characters).
    - Focus on highlighting the user's key technical skills and current role or affiliation.
    - Use keywords relevant to the tech industry and the user's expertise.

2. **Bio ("About" Section) Generation:**
    - Write a LinkedIn "About" section that is approximately under 80 words, keep it concise and to the point.
    - Adopt a professional yet enthusiastic and slightly informal tone, similar to a driven individual sharing their journey.
    - Structure the bio to include the following elements in a logical flow:
    - **Start with a clear statement of the user's core role and expertise** (e.g., "Full Stack Developer").
    - **Provide context on their education**, including degree, major, university, and current status (e.g., "Final Year").
    - **Emphasize their learning approach**, particularly if they are self-taught or focused on practical application. Highlight "learning by building" if applicable.
    - **Include a brief statement of passion or enthusiasm for coding/technology.**
    - **Mention relevant experience**, such as internships, personal projects, or contributions.
    - **Summarize their skills and express confidence in their abilities.**
    - **Conclude with a statement about their eagerness for new challenges and opportunities.**
`;
