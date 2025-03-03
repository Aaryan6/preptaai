"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-medium mb-4">FEATURES</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mx-auto leading-tight">
              Powerful features to simplify your web building experience
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-card rounded-2xl p-6 hover:shadow-lg transition-shadow ${
                index === 2 ? "col-span-2" : ""
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
                  className="w-full h-full object-cover"
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
      "Choose from a wide range of professionally designed templates. Easily customize fonts, colors, and layouts to reflect your brand's.",
    image: "/images/resume.png",
  },
  {
    title: "LinkedIn Bio & Headline Generator",
    description: "Boost your website's visibility with integrated SEO tools.",
    image: "/images/linkedin-bio.png",
  },
  {
    title: "AI Powered Mock Interviews",
    description:
      "Get personalized design recommendations with AI-powered tools that helping you create a polished, professional website effortlessly.",
    image: "/images/mock-interview.png",
  },
];
