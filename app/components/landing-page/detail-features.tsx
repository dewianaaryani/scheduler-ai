"use client";

import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Sparkles,
  Target,
  LineChart,
  Clock,
  Settings,
  Shield,
  Layout,
} from "lucide-react";
import Image from "next/image";

export default function DetailedFeatures() {
  return (
    <ParallaxProvider>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 text-violet-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Fitur Utama
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Fitur Lengkap untuk Produktivitas Optimal
              </h2>
              <p className="text-lg text-gray-600">
                Kalana dilengkapi dengan berbagai fitur yang dirancang untuk
                membantu Anda mengelola tujuan dan jadwal dengan lebih efektif.
              </p>
            </div>
          </Parallax>

          {/* Fitur Pengelolaan Tujuan */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <Parallax translateX={[-50, 50]} opacity={[0.7, 1]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <Card className="relative bg-white border-gray-200 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src="/assets/buat-tujuan.png"
                      width={800}
                      height={600}
                      alt="Pengelolaan Tujuan"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </Parallax>

            <Parallax translateX={[50, -50]} opacity={[0.7, 1]}>
              <div>
                <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                  <Target className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Pengelolaan Tujuan dengan AI
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Fitur utama yang membantu Anda merumuskan dan mengelola target
                  pribadi dengan dukungan kecerdasan buatan untuk memecah tujuan
                  besar menjadi langkah-langkah yang lebih mudah dicapai.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Pemecahan tujuan besar menjadi langkah-langkah kecil otomatis",
                    "Penyesuaian dengan preferensi waktu pengguna",
                    "Deteksi konflik jadwal secara otomatis",
                    "Rekomendasi tujuan berdasarkan histori",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Parallax>
          </div>

          {/* Fitur Pengelolaan Jadwal */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <Parallax
              translateX={[50, -50]}
              opacity={[0.7, 1]}
              className="order-2 lg:order-1"
            >
              <div>
                <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                  <Calendar className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Pengelolaan Jadwal Interaktif
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Sistem kalender yang memungkinkan Anda mengelola jadwal dengan
                  validasi otomatis dan visualisasi yang jelas untuk menghindari
                  konflik waktu.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Validasi otomatis untuk deteksi konflik waktu",
                    "Tampilan kalender mingguan dan bulanan",
                    "Kode warna berdasarkan status kegiatan",
                    "Penambahan catatan pada jadwal",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
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
                      src="/assets/kalender.png"
                      width={800}
                      height={600}
                      alt="Kalender Interaktif"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </Parallax>
          </div>

          {/* Fitur Analisis Produktivitas */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <Parallax translateX={[-50, 50]} opacity={[0.7, 1]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                <Card className="relative bg-white border-gray-200 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src="/assets/analisis-produktivitas.png"
                      width={800}
                      height={600}
                      alt="Analisis Produktivitas"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </div>
            </Parallax>

            <Parallax translateX={[50, -50]} opacity={[0.7, 1]}>
              <div>
                <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                  <LineChart className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                  Analisis Produktivitas
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Dapatkan wawasan mendalam tentang kinerja Anda melalui
                  visualisasi data yang komprehensif untuk mendukung pengambilan
                  keputusan.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Grafik progres pencapaian tujuan",
                    "Statistik produktivitas mingguan",
                    "Insight untuk pengambilan keputusan",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Parallax>
          </div>

          {/* Fitur Tambahan */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-12 text-gray-900">
              Fitur Pendukung Lainnya
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dasbor */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                    <Layout className="h-5 w-5 text-violet-600" />
                  </div>
                  <h4 className="font-bold mb-2 text-gray-900">Dasbor</h4>
                  <p className="text-sm text-gray-600">
                    Menyajikan progres dan daftar jadwal hari tersebut dalam
                    satu tampilan.
                  </p>
                </CardContent>
              </Card>

              {/* Autentikasi */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                    <Shield className="h-5 w-5 text-violet-600" />
                  </div>
                  <h4 className="font-bold mb-2 text-gray-900">
                    Autentikasi Aman
                  </h4>
                  <p className="text-sm text-gray-600">
                    Masuk dengan Google atau GitHub dengan perlindungan akses
                    yang aman.
                  </p>
                </CardContent>
              </Card>

              {/* Preferensi Waktu */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                    <Clock className="h-5 w-5 text-violet-600" />
                  </div>
                  <h4 className="font-bold mb-2 text-gray-900">
                    Preferensi Waktu
                  </h4>
                  <p className="text-sm text-gray-600">
                    Atur ketersediaan waktu sesuai rutinitas pribadi Anda.
                  </p>
                </CardContent>
              </Card>

              {/* Pengaturan */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-violet-100 p-3 rounded-lg inline-block mb-4">
                    <Settings className="h-5 w-5 text-violet-600" />
                  </div>
                  <h4 className="font-bold mb-2 text-gray-900">Pengaturan</h4>
                  <p className="text-sm text-gray-600">
                    Sesuaikan profil dan preferensi aplikasi sesuai kebutuhan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </ParallaxProvider>
  );
}
