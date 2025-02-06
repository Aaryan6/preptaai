"use server";

import { Interview, CreateInterview } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function createInterview(interview: CreateInterview) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interviews")
    .insert(interview)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as Interview;
}

export async function getInterview(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as Interview;
}
