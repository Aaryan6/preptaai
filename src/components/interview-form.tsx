"use client";

import Image from "next/image";
import { useState } from "react";
import InterviewType from "@/app/interview/_components/interview-type";
import Interviewers from "@/app/interview/_components/interviewers";
import UserDetails from "@/app/interview/_components/user-details";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createInterview } from "@/actions/interview";

type UserDetailsType = {
  name: string;
  jobRole: string;
  skills?: string;
  experience?: string;
};

type InterviewData = {
  type: "behavioral" | "technical" | null;
  interviewerId: string | null;
  userDetails?: UserDetailsType;
};

export default function InterviewForm() {
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
    // Here you can handle the final submission of all data
    console.log("Final interview data:", {
      ...interviewData,
      userDetails: details,
    });

    const interview = await createInterview({
      job_role: details.jobRole,
      user_id: user?.id || "",
      experience: details.experience,
      skills: details.skills,
      type: interviewData.type as string,
      voice_id: interviewData.interviewerId as string,
    });

    if (interview) {
      router.push(`/interview/${interview.id}`);
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
    <div className="grid lg:grid-cols-[1fr,400px] h-screen">
      <main className="flex flex-col items-center justify-center p-6 lg:p-12">
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
          />
        ) : (
          <UserDetails
            onSubmit={handleUserDetailsSubmit}
            onBack={handleBack}
            initialData={interviewData.userDetails}
          />
        )}
      </main>
      <aside className="hidden lg:block border-l">
        <div className="sticky top-0 h-screen">
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
