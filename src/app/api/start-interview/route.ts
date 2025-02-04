import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// app/api/start-interview/route.ts
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const data = await req.json();

  const initialContext = {
    name: data.name,
    role: data.jobRole,
    skills: data.skills,
    experience: data.experience,
  };

  // Store in temporary session (use cookies for MVP)
  cookieStore.set("interview-context", JSON.stringify(initialContext));

  return NextResponse.json({ success: true }, { status: 200 });
}
