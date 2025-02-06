import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Updated transformScore function to handle both decimals (0-1) and percentages (0-100)
const transformScore = (n: number) =>
  n <= 1
    ? Math.round(Math.max(0, Math.min(1, n)) * 100)
    : Math.round(Math.max(0, Math.min(100, n)));

// Define the schema for keyword matches
const KeywordMatchSchema = z.object({
  found: z.array(z.string()).min(1, "At least one found keyword is required"),
  missing: z.array(z.string()),
});

// Define the schema for category scores with decimal to percentage transformation
const CategoryScoresSchema = z.object({
  ats: z.number().transform(transformScore),
  content: z.number().transform(transformScore),
  design: z.number().transform(transformScore),
  job_match: z.number().transform(transformScore),
});

// Define the schema for achievements analysis
const AchievementsSchema = z.object({
  good: z.array(z.string()).min(1, "At least one good achievement is required"),
  needs_improvement: z.array(z.string()),
});

// Define the complete resume analysis schema
const ResumeAnalysisSchema = z.object({
  overall_score: z.number().transform(transformScore),
  categories: CategoryScoresSchema,
  keyword_matches: KeywordMatchSchema,
  achievements_analysis: AchievementsSchema,
  design_feedback: z
    .array(z.string())
    .min(1, "At least one design feedback point is required"),
  top_3_strengths: z.array(z.string()).length(3),
  top_3_weaknesses: z.array(z.string()).length(3),
  suggestions: z
    .array(z.string())
    .min(2, "At least two suggestions are required"),
});

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobRole } = await request.json();

    if (!resumeText || !jobRole) {
      return NextResponse.json(
        { error: "Resume text and job role are required" },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: ResumeAnalysisSchema,
      temperature: 0.2, // Lower temperature for more consistent scoring
      prompt: `You are an expert resume analyzer and career coach. Analyze the provided resume for a ${jobRole} position.

IMPORTANT SCORING INSTRUCTIONS:
- All numerical scores MUST be provided as decimals between 0 and 1 (e.g., 0.75 for 75%).
- Ensure that scores are realistic and varied; do not assign a perfect score (1) in every category unless every criterion is exceptionally outstanding.
- For a typical resume, overall scores usually fall between 0.5 and 0.9 (50% to 90%).
- Avoid assigning a score of 1 (100%) for any category unless the resume explicitly shows perfection in that area.
- Consider contextual ranges: for example, ATS scores might typically range from 0.5 to 0.85, Content from 0.5 to 0.9, Design from 0.5 to 0.8, and Job Match from 0.6 to 0.95.
- Be consistent and objective in scoring based on industry standards.

Focus on these key areas:
1. ATS Compatibility (score based on keyword matches, formatting, and parsability)
2. Content Quality (score based on achievements, clarity, and relevance)
3. Design/Formatting (score based on readability, structure, and professional appearance)
4. Job Role Match (score based on alignment with ${jobRole} requirements)

RESUME TEXT:
${resumeText}

Provide a detailed analysis including:
1. Overall score (as a decimal between 0-1) and category scores:
   - ATS score (0-1)
   - Content score (0-1)
   - Design score (0-1)
   - Job match score (0-1)

2. Keyword Analysis:
   - Found keywords (minimum 1)
   - Missing important keywords for ${jobRole}

3. Achievement Analysis:
   - Strong achievements (minimum 1)
   - Achievements needing improvement

4. Design/Formatting Feedback (minimum 1 point)

5. Exactly 3 top strengths

6. Exactly 3 top weaknesses

7. Actionable Suggestions (minimum 2):
   - Specific improvements
   - Industry best practices
   - ${jobRole}-specific enhancements

Return the analysis in the exact schema format requested.`,
    });

    // Validate and normalize the response
    const result = await ResumeAnalysisSchema.safeParseAsync(object);

    if (!result.success) {
      console.error("Validation error:", result.error);
      return NextResponse.json(
        { error: "Analysis format mismatch", details: result.error.format() },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
