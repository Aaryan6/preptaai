"use server";

import { Interview } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function getInterviews(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as Interview[];
}
