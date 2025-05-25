"use client";

import type React from "react";

import { Parallax } from "react-scroll-parallax";
import { Brain, Clock, Target, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Statistics() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Parallax translateY={[20, -20]} opacity={[0.8, 1]}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem
              icon={<Users className="h-8 w-8 text-violet-600" />}
              value={25000}
              label="Pengguna Aktif"
              suffix="+"
            />
            <StatItem
              icon={<Target className="h-8 w-8 text-violet-600" />}
              value={1500000}
              label="Tujuan Tercapai"
              suffix="+"
            />
            <StatItem
              icon={<Clock className="h-8 w-8 text-violet-600" />}
              value={42}
              label="Jam Tersimpan per Minggu"
              suffix="%"
            />
            <StatItem
              icon={<Brain className="h-8 w-8 text-violet-600" />}
              value={99}
              label="Tingkat Kepuasan"
              suffix="%"
            />
          </div>
        </Parallax>
      </div>
    </section>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

function StatItem({ icon, value, label, suffix = "" }: StatItemProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const currentRef = ref.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();
    const endValue = value;

    const animateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const currentValue = Math.floor(progress * endValue);

      if (countRef.current !== currentValue) {
        countRef.current = currentValue;
        setCount(currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, value]);

  const formattedValue = count.toLocaleString();

  return (
    <div
      ref={ref}
      className="bg-white border border-gray-200 rounded-xl p-6 text-center transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-violet-100"
    >
      <div className="bg-violet-50 p-3 rounded-lg inline-block mb-4">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        {formattedValue}
        {suffix}
      </div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}
