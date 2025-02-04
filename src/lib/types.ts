export type Interviews = {
  id: string;
  user_id: string;
  job_role: string;
  skills?: string;
  experience?: string;
  resume_text?: string;
  started_at?: string;
  completed_at?: string;
  status?: string;
  created_at?: string;
};

export type ChatMessages = {
  id: string;
  interview_id: string;
  content: string;
  role: string;
  audio_url?: string;
  created_at?: string;
};
