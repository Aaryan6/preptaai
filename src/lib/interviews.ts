export type Interviewer = {
  id: string;
  name: string;
  behavior: string;
  language: "EN";
  voiceUrl: string;
};

export const interviewers: Interviewer[] = [
  {
    id: "af_alloy",
    name: "Emma",
    behavior: "Friendly and Supportive",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_bella.wav",
  },
  {
    id: "af_aoede",
    name: "Sara",
    behavior: "Professional and Direct",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_bella.wav",
  },
  {
    id: "custom",
    name: "More options",
    behavior: "Select additional voices",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_bella.wav",
  },
];

// Additional voice options available in the dialog
export const additionalVoices: Interviewer[] = [
  {
    id: "af_bella",
    name: "Bella",
    behavior: "Enthusiastic and Encouraging",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_bella.wav",
  },
  {
    id: "af_heart",
    name: "Olivia",
    behavior: "Warm and Patient",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_heart.wav",
  },
  {
    id: "af_jessica",
    name: "Jessica",
    behavior: "Analytical and Thorough",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_jessica.wav",
  },
  {
    id: "af_kore",
    name: "David",
    behavior: "Calm and Methodical",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_kore.wav",
  },
  {
    id: "af_nicole",
    name: "Nicole",
    behavior: "Casual and Conversational",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_nicole.wav",
  },
  {
    id: "af_nova",
    name: "Sophia",
    behavior: "Insightful and Reflective",
    language: "EN",
    voiceUrl:
      "https://yhdoxqjernsufwguhtyd.supabase.co/storage/v1/object/public/interviewers/voices/af_nova.wav",
  },
];
