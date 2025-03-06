"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-medium mb-4">FEATURES</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mx-auto leading-tight">
              Powerful AI tools to boost your interview success
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-card rounded-2xl p-6 hover:shadow-lg transition-shadow ${
                index === 2 ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={cn(
                  "relative mb-6 aspect-video max-h-[250px] w-full",
                  index == 2 && "max-h-[350px]"
                )}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "AI Resume Analyzer",
    description:
      "Get detailed metrics on your resume's content, format, and impact. Receive actionable feedback to optimize your resume for applicant tracking systems and highlight your achievements more effectively.",
    image: "/images/resume.png",
  },
  {
    title: "LinkedIn Bio & Headline Generator",
    description:
      "Create compelling LinkedIn profiles that attract recruiter attention. Our AI analyzes industry trends and best practices to help you craft standout headlines and professional summaries.",
    image: "/images/linkedin-bio.png",
  },
  {
    title: "AI-Powered Mock Interviews",
    description:
      "Practice with realistic interview scenarios led by AI interviewers with different personalities. Receive real-time transcripts and comprehensive feedback on your technical accuracy, communication skills, pacing, and keyword usage to improve your performance.",
    image: "/images/mock-interview.png",
  },
];
