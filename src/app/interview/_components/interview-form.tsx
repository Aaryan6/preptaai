"use client";

import Image from "next/image";
import { useState } from "react";
import InterviewType from "@/app/interview/_components/interview-type";
import Interviewers from "@/app/interview/_components/interviewers";
import UserDetails from "@/app/interview/_components/user-details";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createInterview, Interviewer } from "@/actions/interview";
import {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromDOC,
} from "@/utils/file-extractors";
import { toast, Toaster } from "sonner";
import { InterviewersInfo } from "@/lib/types";

type UserDetailsType = {
  name: string;
  jobRole: string;
  skills?: string;
  experience?: string;
  resume?: File;
  resumeText?: string;
};

type InterviewData = {
  type: "behavioral" | "technical" | null;
  interviewerId: string | null;
  userDetails?: UserDetailsType;
};

interface InterviewFormProps {
  interviewers: InterviewersInfo[];
}

export default function InterviewForm({ interviewers }: InterviewFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<"type" | "interviewer" | "userDetails">(
    "type"
  );
  const [interviewData, setInterviewData] = useState<InterviewData>({
    type: null,
    interviewerId: null,
    userDetails: {
      name: user?.fullName || "",
      jobRole: "",
      skills: "",
      experience: "",
    },
  });

  const handleTypeSelect = (type: "behavioral" | "technical") => {
    setInterviewData((prev) => ({ ...prev, type }));
    setStep("interviewer");
  };

  const handleInterviewerSelect = (interviewerId: string) => {
    setInterviewData((prev) => ({ ...prev, interviewerId }));
    setStep("userDetails");
  };

  const handleUserDetailsSubmit = async (details: UserDetailsType) => {
    setInterviewData((prev) => ({ ...prev, userDetails: details }));

    // Get resume text from either the file or directly from the selected resume
    let resumeText = details.resumeText || "";

    // Extract text from uploaded file if no resumeText was provided but a file was
    if (!resumeText && details.resume) {
      try {
        const fileType = details.resume.name.toLowerCase().split(".").pop();

        // Extract text from resume file based on file type
        switch (fileType) {
          case "pdf":
            resumeText = await extractTextFromPDF(details.resume);
            break;
          case "docx":
            resumeText = await extractTextFromDOCX(details.resume);
            break;
          case "doc":
            resumeText = await extractTextFromDOC(details.resume);
            break;
          default:
            toast.error(
              "Unsupported file type. Please upload a PDF, DOC, or DOCX file."
            );
            return;
        }

        console.log("Resume text extracted successfully");
      } catch (error) {
        console.error("Error extracting resume text:", error);
        toast.error("Failed to process resume. Please try again.");
        return;
      }
    }

    try {
      const interview = await createInterview({
        job_role: details.jobRole,
        user_id: user?.id || "",
        experience: details.experience,
        skills: details.skills,
        type: interviewData.type as string,
        interviewer_id: interviewData.interviewerId as string,
        resume_text: resumeText || undefined,
      });

      if (interview) {
        router.push(`/interview/${interview.id}`);
      } else {
        toast.error("Failed to create interview. Please try again.");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    if (step === "interviewer") {
      setStep("type");
    } else if (step === "userDetails") {
      setStep("interviewer");
    } else {
      router.push("/"); // Go back to home page if on first step
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr,400px] bg-muted h-full">
      <main className="flex flex-col items-center justify-center p-6 lg:p-12">
        <Toaster />
        {step === "type" ? (
          <InterviewType
            onSelect={handleTypeSelect}
            onBack={handleBack}
            selectedType={interviewData.type}
          />
        ) : step === "interviewer" ? (
          <Interviewers
            onSelect={handleInterviewerSelect}
            onBack={handleBack}
            selectedInterviewer={interviewData.interviewerId}
            interviewers={interviewers}
          />
        ) : (
          <UserDetails
            onSubmit={handleUserDetailsSubmit}
            onBack={handleBack}
            initialData={interviewData.userDetails}
            userId={user?.id}
          />
        )}
      </main>
      <aside className="hidden lg:block border-l">
        <div className="sticky top-0 h-full">
          <Image
            src="/images/interview-photo.jpeg"
            alt="Interview Vault Icon"
            fill
            className="object-cover"
          />
        </div>
      </aside>
    </div>
  );
}
