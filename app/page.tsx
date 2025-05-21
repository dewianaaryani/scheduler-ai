"use client";
import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Header from "./components/landing-page/header";
import Hero from "./components/landing-page/hero";
import Statistics from "./components/landing-page/statistics";
import Features from "./components/landing-page/features";
import DetailedFeatures from "./components/landing-page/detail-features";
import HowItWorks from "./components/landing-page/how-it-works";
import Comparison from "./components/landing-page/comparison";
export default function LandingPage() {
  return (
    <ParallaxProvider>
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 text-gray-800">
        <Header />
        <main className="">
          <Hero />
          <Statistics />
          <Features />
          <DetailedFeatures />
          <HowItWorks />
          <Comparison />
        </main>
      </div>
    </ParallaxProvider>
  );
}
