"use client";

import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  ClipboardCheck,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <BrainCircuit className="h-6 w-6 text-violet-600" />,
      title: "AI Analysis",
      description:
        "Connect your calendar and tell us about your goals. Our AI analyzes your current schedule and habits.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-violet-600" />,
      title: "Smart Recommendations",
      description:
        "Receive personalized scheduling recommendations based on your productivity patterns.",
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-violet-600" />,
      title: "Optimized Calendar",
      description:
        "Your calendar is automatically optimized with the perfect balance of work, rest, and goal-focused activities.",
    },
    {
      icon: <ClipboardCheck className="h-6 w-6 text-violet-600" />,
      title: "Track & Adapt",
      description:
        "As you use the system, it learns and adapts to your changing needs and preferences.",
    },
  ];

  return (
    <ParallaxProvider>
      <section id="how-it-works" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-600">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How GoalSync AI Works
              </h2>
              <p className="text-lg text-gray-600">
                Our intelligent system makes scheduling and achieving your goals
                effortless. Here&apos;s how it works:
              </p>
            </div>
          </Parallax>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Parallax translateY={[40, -40]} opacity={[0.7, 1]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white p-1 rounded-2xl border border-gray-200 shadow-lg">
                  <Image
                    src="/assets/ai-page.png"
                    width={800}
                    height={600}
                    alt="GoalSync AI Process"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </Parallax>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <Parallax
                  key={index}
                  translateX={[100, 0]}
                  opacity={[0.5, 1]}
                  startScroll={index * 100}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                      <span className="text-violet-600 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {step.icon}
                        <h3 className="text-xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Parallax>
              ))}

              <Parallax translateY={[20, -20]} opacity={[0.7, 1]}>
                <div className="pt-4">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 h-12 px-6 text-base"
                  >
                    <Link href="/login">
                      Try It Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      </section>
    </ParallaxProvider>
  );
}
