import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import only Poppins
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Define Poppins font
const poppins = Poppins({
  variable: "--font-poppins", // Custom CSS variable
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Adjust weights as needed
});

export const metadata: Metadata = {
  title: "Kalana",
  description: "Your time matters",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster theme="light" richColors />
      </body>
    </html>
  );
}
