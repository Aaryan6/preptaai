"use server";

import { CreateResumeAnalysis, ResumeAnalysis } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function createResumeAnalysis(
  analysis: CreateResumeAnalysis
): Promise<ResumeAnalysis> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume_analysis")
    .insert(analysis)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as ResumeAnalysis;
}

export async function getResumeAnalysis(id: string): Promise<ResumeAnalysis> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as ResumeAnalysis;
}

export async function getUserResumeAnalyses(
  userId: string
): Promise<ResumeAnalysis[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as ResumeAnalysis[];
}
