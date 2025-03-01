export type Interview = {
  id: string;
  user_id: string;
  job_role: string;
  skills?: string;
  experience?: string;
  interviewer_id?: string;
  type?: string;
  resume_text?: string;
  started_at?: string;
  completed_at?: string;
  status?: "pending" | "completed" | "in-progress";
  created_at?: string;
  interviewers_info?: InterviewersInfo;
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

export type ResumeAnalysis = {
  id: string;
  user_id: string;
  file_name: string;
  doc_type: "pdf" | "doc" | "docx" | "txt";
  resume_text: string;
  metrics: {
    content_score: number;
    format_score: number;
    impact_score: number;
    overall_score: number;
  };
  feedback: {
    achievements: string[];
    keywords: string[];
    design_feedback: string[];
    actionable_suggestions: string[];
  };
  categories: {
    [key: string]: number;
  };
  created_at?: string;
};

export type CreateResumeAnalysis = Omit<ResumeAnalysis, "id">;

export type InterviewersInfo = {
  id: string;
  name: string;
  avatar: string;
  voice_id: string;
  gender: string;
  behavior?: string;
  language: string;
  voice_url: string;
  created_at?: string;
};

export type CreateInterviewersInfo = Omit<InterviewersInfo, "id">;
