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
  status?: string;
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
