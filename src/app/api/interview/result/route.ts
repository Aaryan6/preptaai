import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { getMessages } from "@/actions/messages";
import { getInterview } from "@/actions/interview";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

// Define the result schema using Zod
const InterviewResultSchema = z.object({
  metrics: z.object({
    technical_accuracy: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    pacing: z.number().min(0).max(100),
    keyword_usage: z.number().min(0).max(100),
    overall_score: z.number().min(0).max(100),
  }),
  feedback: z.object({
    strengths: z.array(z.string()).length(3),
    weaknesses: z.array(z.string()).length(3),
    improvements: z.array(z.string()).length(3),
  }),
});

export async function POST(req: Request) {
  try {
    const { interviewId } = await req.json();

    // Get interview details and messages
    const interview = await getInterview(interviewId);
    const messages = await getMessages(interviewId);

    // Combine all messages into a transcript
    const transcript = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `You are an expert interview evaluator. Analyze the following interview transcript for a ${
      interview.job_role
    } position and provide a detailed assessment.

Job Details:
- Role: ${interview.job_role}
- Required Skills: ${interview.skills || "General technical skills"}
- Experience Level: ${interview.experience || "Not specified"} years
- Interview Type: ${interview.type || "Technical"}

Evaluation Criteria:
1. Technical Accuracy (Score 0-100):
   - Depth of technical knowledge
   - Accuracy of answers
   - Problem-solving approach

2. Communication (Score 0-100):
   - Clarity of explanations
   - Structured responses
   - Professional language

3. Pacing (Score 0-100):
   - Response timing
   - Confidence level
   - Thought organization

4. Keyword Usage (Score 0-100):
   - Industry terminology
   - Technical vocabulary
   - Role-specific concepts

5. Overall Performance (Score 0-100):
   - Combined assessment
   - Interview effectiveness
   - Job fit

Interview Transcript:
${transcript}

Provide a comprehensive evaluation in this exact JSON format:
{
  "metrics": {
    "technical_accuracy": number (0-100),
    "communication": number (0-100),
    "pacing": number (0-100),
    "keyword_usage": number (0-100),
    "overall_score": number (0-100)
  },
  "feedback": {
    "strengths": [exactly 3 key strengths as strings],
    "weaknesses": [exactly 3 areas for improvement as strings],
    "improvements": [exactly 3 actionable suggestions as strings]
  }
}

Ensure all scores are integers between 0 and 100, and each feedback array contains exactly 3 items.`;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      output: "no-schema",
      prompt,
    });

    // Validate the response against the schema
    const result = InterviewResultSchema.parse(object);

    // Store the result in the database
    const supabase = await createClient();
    const { data: savedResult, error } = await supabase
      .from("interview_results")
      .insert({
        interview_id: interviewId,
        metrics: result.metrics,
        feedback: result.feedback,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving interview result:", error);
      return NextResponse.json(
        { error: "Failed to save interview result" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: savedResult,
      redirect: `/interview/${interviewId}/result`,
    });
  } catch (error) {
    console.error("Error generating interview result:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid response format", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate interview result" },
      { status: 500 }
    );
  }
}
