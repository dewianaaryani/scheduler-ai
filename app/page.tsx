"use client";
import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Header from "./components/landing-page/header";
import Hero from "./components/landing-page/hero";
import Features from "./components/landing-page/features";
import DetailedFeatures from "./components/landing-page/detail-features";
import HowItWorks from "./components/landing-page/how-it-works";
import Footer from "./components/landing-page/footer";
export default function LandingPage() {
  return (
    <ParallaxProvider>
      <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 text-gray-800">
        <Header />
        <main className="">
          <Hero />
          <Features />
          <DetailedFeatures />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </ParallaxProvider>
  );
}
