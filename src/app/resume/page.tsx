import UploadResume from "@/app/resume/_components/upload-resume";

export default async function ResumePage() {
  return (
    <div className="min-h-screen bg-dots-pattern relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-teal-100 text-teal-800 rounded-full px-4 py-2 text-sm font-medium mb-6 flex items-center">
            <div className="bg-teal-500 rounded-full h-2 w-2 mr-2"></div>
            New! AI-powered resume analysis for better job matches
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Upload your resume.
            <br />
            Get insights automatically.
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl">
            Analyze your resume against job descriptions. Focus on what matters
            - matching your skills with employers.
          </p>
        </div>

        {/* Floating elements */}
        <div className="absolute top-40 left-20 hidden lg:block">
          <div className="bg-white rounded-xl shadow-lg p-4 rotate-[-10deg] w-64">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 text-teal-500">⚡</div>
              <span className="text-sm font-medium">Resume Analysis</span>
            </div>
            <div className="text-xs text-gray-600">
              Skills matched: React, TypeScript, Node.js
            </div>
          </div>
        </div>

        <div className="absolute top-[30rem] right-20 hidden lg:block">
          <div className="bg-white rounded-xl shadow-lg p-4 rotate-[5deg] w-64">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 text-teal-500">⚡</div>
              <span className="text-sm font-medium">Job Match</span>
            </div>
            <div className="text-xs text-gray-600">
              85% match for Software Engineer position
            </div>
          </div>
        </div>

        <UploadResume />
      </div>
    </div>
  );
}
