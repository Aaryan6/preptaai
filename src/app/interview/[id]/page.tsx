import { getInterview } from "@/actions/interview";
import InterviewLayout from "@/components/interview-layout";

type Props = Promise<{
  id: string;
}>;

export default async function InterviewPage({ params }: { params: Props }) {
  const { id } = await params;
  const interview = await getInterview(id);
  return (
    <div className="whitespace-pre-wrap">
      <InterviewLayout interview={interview} />
      <pre>{JSON.stringify(interview, null, 2)}</pre>
    </div>
  );
}
