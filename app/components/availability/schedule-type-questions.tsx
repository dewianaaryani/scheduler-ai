"use client";
import { ArrowRight, Calendar, Clock, Info } from "lucide-react";
import { AvailabilityData } from ".";

interface ScheduleTypeQuestionProps {
  data: AvailabilityData;
  updateData: (updates: Partial<AvailabilityData>) => void;
  onNext: () => void;
}

export default function ScheduleTypeQuestion({
  data,
  updateData,
  onNext,
}: ScheduleTypeQuestionProps) {
  const handleSelection = (hasRegularSchedule: boolean) => {
    updateData({ hasRegularSchedule });
    setTimeout(onNext, 300); // Small delay for visual feedback
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Bagaimana pola waktu kesibukan Anda?
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pilih salah satu yang paling menggambarkan rutinitas harian Anda.
          Informasi ini akan membantu kami menyesuaikan jadwal yang optimal
          untuk Anda.
        </p>
      </div>

      {/* Enhanced Options */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Flexible Schedule Option */}
        <div
          onClick={() => handleSelection(false)}
          className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 p-8 transition-all duration-300 ${
            data.hasRegularSchedule === false
              ? "bg-gradient-to-br from-violet-50 to-violet-100 border-primary shadow-xl transform scale-[1.02]"
              : "bg-white border-gray-200 hover:border-primary hover:shadow-lg hover:transform hover:scale-[1.01]"
          }`}
        >
          <div className="space-y-6">
            {/* Icon and Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`p-4 rounded-2xl transition-all duration-300 ${
                  data.hasRegularSchedule === false
                    ? "bg-violet-200 shadow-md"
                    : "bg-gray-100 group-hover:bg-violet-100"
                }`}
              >
                <Clock
                  className={`h-10 w-10 transition-colors ${
                    data.hasRegularSchedule === false
                      ? "text-violet-600"
                      : "text-gray-500 group-hover:text-violet-600"
                  }`}
                />
              </div>
              {data.hasRegularSchedule === false && (
                <div className="bg-violet-500 rounded-full p-2 shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900">
                Jadwal Fleksibel
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Saya tidak memiliki jadwal tetap dan dapat menyesuaikan waktu
                kapan saja
              </p>

              {/* Examples */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="font-medium text-sm text-gray-700 mb-2">
                  Contoh situasi:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                    Freelancer
                  </li>

                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                    Tidak memiliki pekerjaan
                  </li>
                </ul>
              </div>
            </div>

            {/* Selection Indicator */}
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  data.hasRegularSchedule === false
                    ? "text-violet-600"
                    : "text-gray-400"
                }`}
              >
                {data.hasRegularSchedule === false
                  ? "Dipilih"
                  : "Klik untuk memilih"}
              </span>
              <ArrowRight
                className={`h-5 w-5 transition-all ${
                  data.hasRegularSchedule === false
                    ? "text-violet-600 transform translate-x-1"
                    : "text-gray-400 group-hover:text-violet-600 group-hover:transform group-hover:translate-x-1"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Regular Schedule Option */}
        <div
          onClick={() => handleSelection(true)}
          className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 p-8 transition-all duration-300 ${
            data.hasRegularSchedule === true
              ? "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-500 shadow-xl transform scale-[1.02]"
              : "bg-white border-gray-200 hover:border-violet-300 hover:shadow-lg hover:transform hover:scale-[1.01]"
          }`}
        >
          <div className="space-y-6">
            {/* Icon and Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`p-4 rounded-2xl transition-all duration-300 ${
                  data.hasRegularSchedule === true
                    ? "bg-violet-200 shadow-md"
                    : "bg-gray-100 group-hover:bg-violet-100"
                }`}
              >
                <Calendar
                  className={`h-10 w-10 transition-colors ${
                    data.hasRegularSchedule === true
                      ? "text-violet-600"
                      : "text-gray-500 group-hover:text-violet-600"
                  }`}
                />
              </div>
              {data.hasRegularSchedule === true && (
                <div className="bg-violet-500 rounded-full p-2 shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900">
                Jadwal Teratur
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Saya memiliki waktu-waktu sibuk yang konsisten dan rutinitas
                harian yang tetap
              </p>

              {/* Examples */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="font-medium text-sm text-gray-700 mb-2">
                  Contoh situasi:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                    Karyawan dengan jam kerja tetap
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                    Mahasiswa dengan jadwal kuliah tetap
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                    Memiliki komitmen rutin (kursus, dll)
                  </li>
                </ul>
              </div>
            </div>

            {/* Selection Indicator */}
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  data.hasRegularSchedule === true
                    ? "text-violet-600"
                    : "text-gray-400"
                }`}
              >
                {data.hasRegularSchedule === true
                  ? "Dipilih"
                  : "Klik untuk memilih"}
              </span>
              <ArrowRight
                className={`h-5 w-5 transition-all ${
                  data.hasRegularSchedule === true
                    ? "text-violet-600 transform translate-x-1"
                    : "text-gray-400 group-hover:text-violet-600 group-hover:transform group-hover:translate-x-1"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="bg-gray-50 rounded-2xl p-6  mx-auto">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 rounded-full p-2 flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">
              Mengapa informasi ini penting?
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dengan memahami pola waktu Anda, sistem dapat memberikan
              rekomendasi jadwal yang lebih akurat. Jika Anda memilih
              &quot;Jadwal Teratur&quot;, Anda akan diminta untuk menentukan
              waktu-waktu sibuk spesifik. Jika memilih &quot;Jadwal
              Fleksibel&quot;, Anda akan diberi pilihan untuk membatasi waktu
              penjadwalan atau menyerahkan sepenuhnya pada sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
