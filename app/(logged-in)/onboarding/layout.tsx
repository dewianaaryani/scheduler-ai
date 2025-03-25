import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F6F6FA]">
      <div className="flex flex-col px-30 py-10 items-center justify-center gap-4 text-center bg-white rounded-3xl shadow-sm">
        <div className="grid gap-2 items-center">
          <span className="text-2xl font-extrabold tracking-[0.2em]">
            KALA<span className="text-primary">NA</span>
          </span>
          <span className="text-md text-zinc-600 font-semibold">
            Make your life organize with AI Generate Schedule
          </span>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
