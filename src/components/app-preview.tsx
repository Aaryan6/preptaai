import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppPreview() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-20">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:block w-64 border-r border-gray-200 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-sm" />
              </div>
              <span className="font-semibold">NotaAI</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2"
                  />
                </svg>
                <span>Mock Interviews</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Resume Review</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>LinkedIn Bio</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <Button
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>
                    Upgrade to Pro for unlimited mock interviews and AI feedback
                  </span>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  Upgrade Now
                </Button>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-medium text-gray-600">
                  Today&apos;s Sessions
                </h2>
                {[
                  "Software Engineer Interview Prep",
                  "Resume Review Session",
                  "Behavioral Interview Practice",
                  "Technical Interview Prep",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-sm font-medium mb-1">Trusted by job seekers from</p>
        <p className="text-sm text-gray-600">
          top tech companies and Fortune 500 firms
        </p>
      </div>
    </div>
  );
}
