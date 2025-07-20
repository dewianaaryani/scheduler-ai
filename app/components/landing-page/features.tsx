"use client";

import { Parallax } from "react-scroll-parallax";
import {
  Brain,
  Calendar,
  Clock,
  LineChart,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-violet-600" />,
      title: "AI-Powered Analysis",
      description:
        "Our AI analyzes your habits, preferences, and productivity patterns to create optimal schedules.",
    },
    {
      icon: <Target className="h-6 w-6 text-violet-600" />,
      title: "Goal Tracking",
      description:
        "Set and track your goals with intelligent progress monitoring and adaptive scheduling.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet-600" />,
      title: "Smart Calendar",
      description:
        "Automatically schedules tasks and breaks at optimal times based on your energy levels.",
    },
    {
      icon: <Zap className="h-6 w-6 text-violet-600" />,
      title: "Personalized Profiles",
      description:
        "Tailor your experience to your unique needs and preferences.",
    },
    {
      icon: <Clock className="h-6 w-6 text-violet-600" />,
      title: "Time Blocking",
      description:
        "Creates focused time blocks for deep work with built-in breaks to maintain energy.",
    },
    {
      icon: <LineChart className="h-6 w-6 text-violet-600" />,
      title: "Progress Analytics",
      description:
        "Detailed insights and analytics to help you understand and improve your productivity.",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 text-violet-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Everything You Need to Achieve Your Goals
            </h2>
            <p className="text-lg text-gray-600">
              GoalSync AI combines cutting-edge artificial intelligence with
              proven productivity techniques to help you accomplish more with
              less stress.
            </p>
          </div>
        </Parallax>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Parallax
              key={index}
              translateY={[40, -40]}
              opacity={[0.6, 1]}
              startScroll={(index % 3) * 100}
              className="h-full"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 h-full transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-violet-100 group">
                <div className="bg-violet-50 p-3 rounded-lg inline-block mb-4 group-hover:bg-violet-100 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-violet-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
