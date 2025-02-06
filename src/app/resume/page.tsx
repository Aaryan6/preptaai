import UploadResume from "@/components/upload-resume";

export default async function ResumePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
      <h1 className="text-2xl font-bold mb-8">Upload your resume</h1>
      <UploadResume />
    </div>
  );
}
