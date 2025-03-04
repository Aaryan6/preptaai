import { getInterview } from "@/actions/interview";
import InterviewLayout from "@/app/interview/[id]/_components/interview-layout";
import { redirect } from "next/navigation";

type Props = Promise<{
  id: string;
}>;

export default async function InterviewPage({ params }: { params: Props }) {
  const { id } = await params;
  const interview = await getInterview(id);

  if (interview?.status === "completed") {
    redirect(`/interview/${id}/result`);
  }

  return <InterviewLayout interview={interview} />;
}
