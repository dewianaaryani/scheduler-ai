"use client";
import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Header from "./components/landing-page/header";
import Hero from "./components/landing-page/hero";
import Statistics from "./components/landing-page/statistics";
import Features from "./components/landing-page/features";
export default function LandingPage() {
  return (
    <ParallaxProvider>
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 text-gray-800">
        <Header />
        <main className="">
          <Hero />
          <Statistics />
          <Features />
        </main>
      </div>
    </ParallaxProvider>
  );
}
