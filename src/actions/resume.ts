"use server";

import { CreateResumeAnalysis, ResumeAnalysis } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function createResumeAnalysis(
  data: CreateResumeAnalysis
): Promise<ResumeAnalysis> {
  const supabase = await createClient();

  const { data: resumeAnalysis, error } = await supabase
    .from("resume_analysis")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return resumeAnalysis;
}

export async function getResumeAnalysis(
  id: string
): Promise<ResumeAnalysis | null> {
  const supabase = await createClient();

  const { data: resumeAnalysis, error } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return resumeAnalysis;
}
