"use client";

import { Parallax } from "react-scroll-parallax";
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
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-400">
              <Sparkles className="h-4 w-4 mr-2" />
              Fitur Unggulan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Teknologi AI untuk Produktivitas Maksimal
            </h2>
            <p className="text-lg text-white/70">
              GoalSync AI menggunakan teknologi kecerdasan buatan terdepan untuk
              membantu Anda mencapai tujuan dengan lebih efisien dan efektif.
            </p>
          </div>
        </Parallax>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <Parallax translateX={[-50, 50]} opacity={[0.7, 1]}>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-30"></div>
              <Card className="relative bg-slate-800 border-white/10 overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
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
              <div className="bg-violet-500/20 p-3 rounded-lg inline-block mb-4">
                <Brain className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Analisis AI yang Mendalam
              </h3>
              <p className="text-lg text-white/70 mb-6">
                Algoritma AI kami menganalisis pola produktivitas, kebiasaan,
                dan preferensi Anda untuk menciptakan jadwal yang benar-benar
                personal dan optimal.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Mengidentifikasi waktu produktif puncak Anda",
                  "Menyesuaikan dengan ritme sirkadian alami Anda",
                  "Mempelajari kebiasaan dan preferensi Anda dari waktu ke waktu",
                  "Memberikan rekomendasi yang semakin akurat seiring penggunaan",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-violet-500" />
                    </div>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                Pelajari Lebih Lanjut
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
              <div className="bg-violet-500/20 p-3 rounded-lg inline-block mb-4">
                <Target className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Pelacakan Tujuan yang Cerdas
              </h3>
              <p className="text-lg text-white/70 mb-6">
                Tetapkan tujuan Anda dan biarkan GoalSync AI memecahnya menjadi
                langkah-langkah yang dapat dicapai dan menjadwalkannya secara
                optimal di kalender Anda.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Pemecahan tujuan besar menjadi tugas yang lebih kecil dan terkelola",
                  "Penjadwalan otomatis berdasarkan tenggat waktu dan prioritas",
                  "Pengingat dan notifikasi yang disesuaikan",
                  "Visualisasi kemajuan yang jelas dan memotivasi",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-violet-500" />
                    </div>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                Lihat Demo
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-30"></div>
              <Card className="relative bg-slate-800 border-white/10 overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-30"></div>
              <Card className="relative bg-slate-800 border-white/10 overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
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
              <div className="bg-violet-500/20 p-3 rounded-lg inline-block mb-4">
                <Calendar className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Kalender Pintar
              </h3>
              <p className="text-lg text-white/70 mb-6">
                Kalender kami tidak hanya menampilkan jadwal Anda, tetapi secara
                aktif membantu Anda mengelola waktu dengan lebih efektif.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Integrasi mulus dengan Google Calendar, Outlook, dan Apple Calendar",
                  "Penjadwalan otomatis tugas pada waktu yang optimal",
                  "Pemblokiran waktu cerdas untuk pekerjaan mendalam",
                  "Penyesuaian otomatis saat jadwal Anda berubah",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-violet-500" />
                    </div>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
                Coba Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
