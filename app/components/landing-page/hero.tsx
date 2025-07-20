"use client";
import {
  Parallax,
  ParallaxBanner,
  ParallaxBannerLayer,
} from "react-scroll-parallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col w-full px-8 mt-18">
      <ParallaxBanner className="absolute inset-0 h-full w-full">
        <ParallaxBannerLayer speed={-20}>
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        </ParallaxBannerLayer>
        <ParallaxBannerLayer speed={-15}>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-100 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-100 blur-3xl"></div>
        </ParallaxBannerLayer>
        <ParallaxBannerLayer speed={-10}>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-violet-100 blur-2xl"></div>
        </ParallaxBannerLayer>
      </ParallaxBanner>

      <div className="w-full relative z-10 pt-45">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-1/2 px-4 md:px-8 lg:px-12">
            <Parallax translateY={[0, -50]} opacity={[1, 0.8]}>
              <div className="inline-block px-4 py-1.5 mb-2 text-sm font-medium rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 text-violet-700">
                Introducing Kalana App
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Achieve Your Goals with AI-Powered Scheduling
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Kalana App analyzes your goals, habits, and calendar to create
                the perfect schedule that maximizes your productivity and
                well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 h-12 px-6 text-base"
                >
                  <Link href="/login">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 h-12 px-6 text-base"
                >
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-8 text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-violet-600" />
                  <span className="text-sm">Free</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-violet-600" />
                  <span className="text-sm">Newest ai version</span>
                </div>
              </div>
            </Parallax>
          </div>

          <div className="w-full md:w-1/2 pl-4 pr-4 md:pr-8 lg:pr-12 mt-12 lg:mt-0">
            <Parallax translateY={[0, -30]} opacity={[1, 0.9]}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white p-1 rounded-2xl border border-gray-200 shadow-xl">
                  <Image
                    src="/assets/dashboard.png"
                    width={800}
                    height={600}
                    alt="Kalana App Dashboard"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Goal Completed
                      </p>
                      <p className="text-xs text-gray-500">Daily Meditation</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Next Task
                      </p>
                      <p className="text-xs text-gray-500">Project Planning</p>
                    </div>
                  </div>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
