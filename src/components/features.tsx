"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
              <div className="relative mb-6">
                <div
                  className={cn(
                    "relative h-[200px] w-full rounded-lg bg-gray-50 overflow-hidden",
                    index === 2 ? "h-[300px]" : ""
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/10 via-gray-50/80 to-gray-50" />
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary" />
                  <div className="absolute top-4 left-8 w-48 h-2 rounded-full bg-gray-200" />
                  <div className="absolute top-10 left-8 w-32 h-2 rounded-full bg-gray-200" />
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-8 rounded-md bg-primary" />
                </div>
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
    title: "AI Powered Mock Interviews",
    description:
      "Get personalized design recommendations with AI-powered tools that helping you create a polished, professional website effortlessly.",
  },
  {
    title: "AI Resume Analyzer",
    description:
      "Choose from a wide range of professionally designed templates. Easily customize fonts, colors, and layouts to reflect your brand's.",
  },
  {
    title: "LinkedIn Bio & Headline Generator",
    description: "Boost your website's visibility with integrated SEO tools.",
  },
];
