export type Interviewer = {
  id: string;
  name: string;
  role: string;
  language: "EN";
};

export const interviewers: Interviewer[] = [
  {
    id: "af_aoede",
    name: "Aoede",
    role: "Software Engineering",
    language: "EN",
  },

  {
    id: "af_kore",
    name: "Kore",
    role: "Product Management",
    language: "EN",
  },
  {
    id: "bm_george",
    name: "George",
    role: "Other",
    language: "EN",
  },
];
