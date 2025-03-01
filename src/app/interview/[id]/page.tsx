import { getInterview } from "@/actions/interview";
import InterviewLayout from "@/app/interview/[id]/_components/interview-layout";

type Props = Promise<{
  id: string;
}>;

export default async function InterviewPage({ params }: { params: Props }) {
  const { id } = await params;
  const interview = await getInterview(id);
  return <InterviewLayout interview={interview} />;
}
