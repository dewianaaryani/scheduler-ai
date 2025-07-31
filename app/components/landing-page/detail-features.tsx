"use client";

import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";

export default function DetailedFeatures() {
  return (
    <ParallaxProvider>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Core Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Technology for Maximum Productivity
              </h2>
              <p className="text-lg text-gray-600">
                Kalana App uses cutting-edge artificial intelligence technology
                to help you achieve your goals more efficiently and effectively.
              </p>
            </div>
          </Parallax>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <Parallax translateX={[-50, 50]} opacity={[0.7, 1]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <Card className="relative bg-white border-gray-200 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src="/assets/analytics.png"
                      width={800}
                      height={600}
                      alt="AI-Powered Analysis"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </Parallax>

            <Parallax translateX={[50, -50]} opacity={[0.7, 1]}>
              <div>
                <div className="bg-violet-500/10 p-3 rounded-lg inline-block mb-4">
                  <Brain className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  In-Depth AI Analysis
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our AI algorithms analyze your productivity patterns, habits,
                  and preferences to create truly personalized and optimal
                  schedules.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Identifies your peak productivity hours",
                    "Adapts to your natural circadian rhythm",
                    "Learns your habits and preferences over time",
                    "Provides increasingly accurate recommendations with usage",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Parallax>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <Parallax
              translateX={[50, -50]}
              opacity={[0.7, 1]}
              className="order-2 lg:order-1"
            >
              <div>
                <div className="bg-violet-500/10 p-3 rounded-lg inline-block mb-4">
                  <Target className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Smart Goal Tracking
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Set your goals and let Kalana App break them down into
                  achievable steps and optimally schedule them in your calendar.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Breaks large goals into smaller, manageable tasks",
                    "Automatic scheduling based on deadlines and priorities",
                    "Customized reminders and notifications",
                    "Clear and motivating progress visualization",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Parallax>

            <Parallax
              translateX={[-50, 50]}
              opacity={[0.7, 1]}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <Card className="relative bg-white border-gray-200 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src="/assets/on-boarding.png"
                      width={800}
                      height={600}
                      alt="Goal Tracking"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </Parallax>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Parallax translateX={[-50, 50]} opacity={[0.7, 1]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <Card className="relative bg-white border-gray-200 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src="/assets/calendar-weekly.png"
                      width={800}
                      height={600}
                      alt="Smart Calendar"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </Parallax>

            <Parallax translateX={[50, -50]} opacity={[0.7, 1]}>
              <div>
                <div className="bg-violet-500/10 p-3 rounded-lg inline-block mb-4">
                  <Calendar className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Intelligent Calendar
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our calendar doesn&apos;t just display your schedule, but actively
                  helps you manage time more effectively.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Seamless integration with Google Calendar, Outlook, and Apple Calendar",
                    "Automatic task scheduling at optimal times",
                    "Smart time blocking for deep work sessions",
                    "Automatic adjustments when your schedule changes",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                  Try Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Parallax>
          </div>
        </div>
      </section>
    </ParallaxProvider>
  );
}
