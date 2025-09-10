import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import only Poppins
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextStepProvider, NextStep } from "nextstepjs";
import ShadcnCustomCard from "./components/custom-card";

// Define Poppins font
const poppins = Poppins({
  variable: "--font-poppins", // Custom CSS variable
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Adjust weights as needed
});
const steps = [
  {
    tour: "mainTour",
    steps: [
      {
        icon: <>🏠</>,
        title: "Dasbor",
        content: <>Ini adalah halaman untuk melihat aktivitas hari ini</>,
        selector: "#dasbor",
        side: "right" as const,
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>🎉</>,
        title: "Daftar Tujuan",
        content: <>Disini Anda bisa melihat daftar tujuan yang sudah dibuat</>,
        selector: "#daftar-tujuan",
        side: "right" as const,
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>🎉</>,
        title: "Buat Tujuan Baru",
        content: <>Disini Anda dapat membuat tujuan baru dengan bantuan AI</>,
        selector: "#buat-tujuan",
        side: "right" as const,
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>📅</>,
        title: "Kalender",
        content: (
          <>Di sini Anda dapat melihat dan mengelola status jadwal Anda</>
        ),
        selector: "#kalender",
        side: "right" as const,
        showControls: true,
        showSkip: true,
        pointerPadding: 5,
        pointerRadius: 10,
      },
      {
        icon: <>📈</>,
        title: "Analisis Produktivitas",
        content: <>Di sini Anda dapat melihat analisis produktivitas Anda</>,
        selector: "#analisis-produktivitas",
        side: "right" as const,
        showControls: true,
        showSkip: true,
        pointerPadding: 5,
        pointerRadius: 10,
      },
      {
        icon: <>⚙️</>,
        title: "Pengaturan",
        content: <>Di sini Anda dapat mengatur dan keluar dari Akun</>,
        selector: "#pengaturan-akun",
        side: "bottom-right" as const, // Changed from "left" to "bottom" for top elements
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 30,
        offset: 15,
        align: "end",
        viewportPadding: 20,
      },
    ],
  },
];
export const metadata: Metadata = {
  title: "Kalcer",
  description: "Your time matters",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <NextStepProvider>
          <NextStep steps={steps} cardComponent={ShadcnCustomCard}>
            {children}
            <Toaster theme="light" richColors />
          </NextStep>
        </NextStepProvider>
      </body>
    </html>
  );
}
