"use client";

import { getResumeAnalysis, getUserResumeAnalyses } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  FileText,
  Loader,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDetailsProps {
  onSubmit: (details: {
    name: string;
    jobRole: string;
    skills?: string;
    experience?: string;
    resume?: File;
    resumeText?: string;
  }) => void;
  onBack: () => void;
  initialData?: {
    name: string;
    jobRole: string;
    skills?: string;
    experience?: string;
  };
  username?: string;
  userId?: string;
}

export default function UserDetails({
  onSubmit,
  onBack,
  initialData,
  userId,
}: UserDetailsProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    jobRole: initialData?.jobRole || "",
    skills: initialData?.skills || "",
    experience: initialData?.experience || "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(false);
  const [userResumes, setUserResumes] = useState<
    { id: string; label: string; value: string; resume_text: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");

  const handleSubmit = () => {
    setIsLoading(true);
    // Only validate required fields (name and jobRole)
    if (formData.name.trim() && formData.jobRole.trim()) {
      onSubmit({
        name: formData.name,
        jobRole: formData.jobRole,
        // Only include optional fields if they have content
        ...(formData.skills.trim() && { skills: formData.skills }),
        ...(formData.experience.trim() && { experience: formData.experience }),
        ...(resumeFile && { resume: resumeFile }),
        ...(resumeText && { resumeText: resumeText }),
      });
    }
    setIsLoading(false);
  };

  const fetchUserResumes = async () => {
    if (!userId) {
      toast.error("User ID is required to fetch resumes");
      return;
    }

    setFetchingResumes(true);
    try {
      const resumes = await getUserResumeAnalyses(userId);
      const formattedResumes = resumes.map((resume) => ({
        id: resume.id,
        label: `${resume.file_name} (${format(
          new Date(resume.created_at || ""),
          "MMM dd, yyyy"
        )})`,
        value: resume.id,
        resume_text: resume.resume_text,
      }));

      setUserResumes(formattedResumes);

      if (formattedResumes.length === 0) {
        toast.info("No resumes found. Please upload a new resume.");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to fetch resumes. Please try again.");
    } finally {
      setFetchingResumes(false);
    }
  };

  const handleResumeSelect = async (resumeId: string) => {
    try {
      setIsLoading(true);
      setSelectedResumeId(resumeId);

      // Get the resume text from the already fetched resumes
      const selectedResume = userResumes.find(
        (resume) => resume.id === resumeId
      );

      if (selectedResume?.resume_text) {
        setResumeText(selectedResume.resume_text);
        toast.success("Resume loaded successfully");
      } else {
        toast.error("Failed to load resume text");
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      toast.error("Failed to load resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only check required fields for form validation
  const isFormValid = formData.name.trim() && formData.jobRole.trim();

  return (
    <div className="w-full max-w-2xl space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Tell us about yourself
      </h1>
      <p className="text-muted-foreground">
        Please provide your details to personalize your interview experience.
      </p>
      <div className="space-y-4 pt-4">
        <Card className="p-4 bg-background/70">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobRole" className="text-muted-foreground">
                Job Role *
              </Label>
              <Input
                id="jobRole"
                placeholder="Software Engineer"
                value={formData.jobRole}
                onChange={(e) =>
                  setFormData({ ...formData, jobRole: e.target.value })
                }
                required
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="skills" className="text-muted-foreground">
                Key Skills (Optional)
              </Label>
              <Input
                id="skills"
                placeholder="React, Node.js, TypeScript"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="experience" className="text-muted-foreground">
                Years of Experience (Optional)
              </Label>
              <Input
                id="experience"
                placeholder="2 years"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="p-6 px-4 bg-muted"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="resume" className="text-muted-foreground">
                  Resume (Optional)
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUserResumes}
                  disabled={fetchingResumes || !userId}
                  className="flex items-center gap-1 text-xs"
                >
                  {fetchingResumes ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Already uploaded?</>
                  )}
                </Button>
              </div>

              {resumeText ? (
                <div className="flex items-center gap-2 mt-2 bg-muted p-3 rounded-md">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Resume Selected</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {userResumes.find((r) => r.id === selectedResumeId)
                        ?.label || "Resume loaded"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResumeText("");
                      setSelectedResumeId("");
                    }}
                    className="h-7 px-2"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  {userResumes.length > 0 && !resumeFile && (
                    <Select
                      value={selectedResumeId}
                      onValueChange={handleResumeSelect}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a previously uploaded resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {userResumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span>{resume.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="p-2 bg-muted"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setResumeFile(e.target.files[0]);
                          setResumeText("");
                          setSelectedResumeId("");
                        }
                      }}
                    />
                  </div>
                  {resumeFile && (
                    <div className="flex items-center p-2 bg-muted rounded-md">
                      <span className="text-sm text-muted-foreground truncate">
                        {resumeFile.name}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button disabled={!isFormValid || isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span>Continue</span>
              <Loader className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
