export type Interview = {
  id: string;
  user_id: string;
  job_role: string;
  skills?: string;
  experience?: string;
  voice_id?: string;
  type?: string;
  resume_text?: string;
  started_at?: string;
  completed_at?: string;
  status?: "pending" | "completed" | "in-progress";
  created_at?: string;
};

export type CreateInterview = Omit<Interview, "id">;

export type ChatMessages = {
  id: string;
  interview_id: string;
  content: string;
  role: string;
  audio_url?: string;
  created_at?: string;
};

export type InterviewResult = {
  id: string;
  interview_id: string;
  metrics: {
    technical_accuracy: number;
    communication: number;
    pacing: number;
    keyword_usage: number;
    overall_score: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  created_at?: string;
};
