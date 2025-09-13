"use client";

import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  UserPlus,
  Target,
  Calendar,
  LineChart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6 text-violet-600" />,
      title: "Masuk akun & Atur Preferensi",
      description:
        "Buat akun dengan Google atau GitHub, lalu atur preferensi penyesuaian waktu sesuai rutinitas harian Anda.",
    },
    {
      icon: <Target className="h-6 w-6 text-violet-600" />,
      title: "Tetapkan Tujuan",
      description:
        "Masukkan rencana tujuan yang ingin dicapai. AI akan memecahnya menjadi langkah-langkah kecil yang terukur.",
    },
    {
      icon: <LineChart className="h-6 w-6 text-violet-600" />,
      title: "Pantau & Analisis",
      description:
        "Kelola jadwal harian dan dapatkan analisis produktivitas seminggu terakhir Anda.",
    },
  ];

  return (
    <ParallaxProvider>
      <section id="how-it-works" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Cara Kerja Kalcer
              </h2>
              <p className="text-lg text-gray-600">
                Mulai dari Masuk akun hingga analisis produktivitas, Kalcer
                memandu Anda di setiap langkah dengan sistem yang mudah dan
                intuitif.
              </p>
            </div>
          </Parallax>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Parallax translateY={[40, -40]} opacity={[0.7, 1]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white p-1 rounded-2xl border border-gray-200 shadow-lg">
                  <Image
                    src="/assets/generate-tujuan.png"
                    width={800}
                    height={600}
                    alt="Proses Kalcer"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </Parallax>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <Parallax
                  key={index}
                  translateX={[30, 0]}
                  opacity={[0.6, 1]}
                  startScroll={0}
                  className="pr-4"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200">
                      <span className="text-violet-600 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {step.icon}
                        <h3 className="text-xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 break-words">
                        {step.description}
                      </p>
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
                      Mulai Sekarang
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
