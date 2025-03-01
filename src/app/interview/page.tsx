import InterviewForm from "@/app/interview/_components/interview-form";
import { getInterviewersInfo } from "@/actions/interviewers";

export default async function InterviewPage() {
  // Fetch interviewers on the server
  const interviewers = await getInterviewersInfo();

  return <InterviewForm interviewers={interviewers} />;
}
