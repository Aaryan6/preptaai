import { InterviewCard } from "@/app/dashboard/_components/interview-card";
import { ResumeCard } from "@/app/dashboard/_components/resume-card";
import { getInterviews } from "@/actions/dashboard";
import { getUserResumeAnalyses } from "@/actions/resume";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [interviews, resumeAnalyses] = await Promise.all([
    getInterviews(userId),
    getUserResumeAnalyses(userId),
  ]);

  console.log({ resumeAnalyses });

  return (
    <div className="h-screen overflow-y-auto bg-muted">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Interviews Section */}
          <div className="mb-12 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Your Interviews
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your interview progress and review past sessions
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {interviews.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No interviews found. Start a new interview to begin.
                </div>
              ) : (
                interviews.map((interview) => (
                  <div key={interview.id}>
                    <InterviewCard
                      id={interview.id}
                      title={interview.job_role}
                      type={interview.type as "technical" | "behavioral"}
                      status={
                        interview.status === "pending"
                          ? "in-progress"
                          : interview.status || "in-progress"
                      }
                      date={
                        interview.created_at
                          ? new Date(interview.created_at).toLocaleDateString()
                          : "N/A"
                      }
                      duration="30 min"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resume Analyses Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Resume Analyses
            </h2>
            <p className="text-lg text-muted-foreground">
              Review your resume analyses and track improvements
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumeAnalyses.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No resume analyses found. Upload your resume to get started.
                </div>
              ) : (
                resumeAnalyses.map((analysis) => (
                  <div key={analysis.id}>
                    <ResumeCard
                      id={analysis.id}
                      fileName={analysis.file_name}
                      docType={analysis.doc_type}
                      date={
                        analysis.created_at
                          ? new Date(analysis?.created_at).toLocaleDateString()
                          : "N/A"
                      }
                      score={analysis.metrics?.overall_score}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
