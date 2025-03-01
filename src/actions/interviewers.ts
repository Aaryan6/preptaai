"use server";

import { InterviewersInfo } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function getInterviewersInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("interviewers_info").select("*");
  if (error) {
    console.error("Error fetching interviewers info:", error);
  }
  return data as InterviewersInfo[];
}

export async function getInterviewerInfo(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interviewers_info")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching interviewers info:", error);
    return { error: "Failed to fetch interviewers info" };
  }
  return data as InterviewersInfo;
}
