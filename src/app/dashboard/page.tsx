import { InterviewCard } from "@/app/dashboard/_components/interview-card";
import { getInterviews } from "@/actions/dashboard";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const interviews = await getInterviews(userId);

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Your Interviews
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your interview progress and review past sessions
            </p>
          </div>
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
      </main>
    </div>
  );
}
