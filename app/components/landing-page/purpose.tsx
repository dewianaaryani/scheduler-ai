"use client";

import { Parallax } from "react-scroll-parallax";
import {
  Target,
  Clock,
  TrendingUp,
  Brain,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function Purpose() {
  const tujuan = [
    {
      icon: <Target className="h-6 w-6 text-violet-600" />,
      title: "Memecah Tujuan Besar",
      description:
        "Membantu pengguna memecah tujuan besar menjadi langkah-langkah kecil yang lebih mudah dicapai dengan bantuan AI.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet-600" />,
      title: "Penjadwalan Otomatis",
      description:
        "Menghasilkan jadwal yang disesuaikan dengan preferensi waktu pengguna dan menghindari konflik dengan jadwal yang sudah ada.",
    },
    {
      icon: <Clock className="h-6 w-6 text-violet-600" />,
      title: "Manajemen Waktu Efisien",
      description:
        "Membantu pengguna mengatur waktu dengan lebih baik melalui visualisasi kalender yang jelas dan terstruktur.",
    },
    {
      icon: <Brain className="h-6 w-6 text-violet-600" />,
      title: "Rekomendasi Berbasis AI",
      description: "Memberikan rekomendasi tujuan berdasarkan histori.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-violet-600" />,
      title: "Analisis Produktivitas",
      description:
        "Menyediakan data kinerja dalam bentuk grafik dan statistik untuk mendukung pengambilan keputusan.",
    },
  ];

  return (
    <section id="tujuan" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 text-violet-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Tujuan Aplikasi
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Tujuan KALCER
            </h2>
            <p className="text-lg text-gray-600">
              Aplikasi manajemen jadwal yang menggunakan kecerdasan artifisial
              untuk membantu pengguna umur 22-40 tahun memecah tujuan besar
              menjadi jadwal-jadwal kecil yang lebih mudah dijalankan.
            </p>
          </div>
        </Parallax>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
          {tujuan.map((item, index) => (
            <Parallax
              key={index}
              translateY={[40, -40]}
              opacity={[0.6, 1]}
              startScroll={(index % 3) * 100}
              className="h-full"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 h-full transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-violet-100 group">
                <div className="bg-violet-50 p-3 rounded-lg inline-block mb-4 group-hover:bg-violet-100 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-violet-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {item.description}
                </p>
              </div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
