"use client";

import { Parallax } from "react-scroll-parallax";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

export default function Comparison() {
  const features = [
    "AI-Powered Scheduling",
    "Goal Tracking",
    "Smart Calendar",
    "Time Blocking",
    "Progress Analytics",
    "Personalized Recommendations",
    "Calendar Integration",
    "Mobile App",
    "Team Collaboration",
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Mengapa Memilih GoalSync AI?
            </h2>
            <p className="text-lg text-white/70">
              Lihat bagaimana GoalSync AI dibandingkan dengan aplikasi
              produktivitas tradisional lainnya.
            </p>
          </div>
        </Parallax>

        <Parallax translateY={[40, -40]} opacity={[0.7, 1]}>
          <Card className="bg-slate-800 border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 md:p-6 bg-slate-700/30 text-white font-medium">
                        Fitur
                      </th>
                      <th className="p-4 md:p-6 bg-slate-700/30 text-center">
                        <div className="text-violet-400 font-bold text-lg">
                          GoalSync AI
                        </div>
                        <div className="text-white/60 text-sm">
                          AI-Powered Scheduler
                        </div>
                      </th>
                      <th className="p-4 md:p-6 bg-slate-700/30 text-center">
                        <div className="text-white font-bold">
                          Aplikasi Tradisional
                        </div>
                        <div className="text-white/60 text-sm">
                          To-Do & Calendar Apps
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="p-4 md:p-6 text-white/80">{feature}</td>
                        <td className="p-4 md:p-6 text-center">
                          <Check className="h-5 w-5 text-violet-400 mx-auto" />
                        </td>
                        <td className="p-4 md:p-6 text-center">
                          {index < 3 ? (
                            <Check className="h-5 w-5 text-white/40 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-white/40 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Parallax>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 h-12 px-8 text-base">
            Mulai Gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-white/50 text-sm mt-4">
            Tidak perlu kartu kredit. Uji coba gratis 14 hari.
          </p>
        </div>
      </div>
    </section>
  );
}
