"use client";

export function ProgressChart() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-4xl font-bold">$14K</p>
      </div>

      <div className="relative h-[300px] w-[300px] mx-auto">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full bg-red-100 opacity-20"></div>

        {/* Middle circle */}
        <div className="absolute inset-[30px] rounded-full bg-red-200 opacity-40"></div>

        {/* Inner circle */}
        <div className="absolute inset-[60px] rounded-full bg-red-300 opacity-60"></div>

        {/* Center circle */}
        <div className="absolute inset-[90px] rounded-full bg-red-500"></div>

        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-bold">$4K</div>
        </div>

        <div className="absolute top-[60px] left-[60px] text-sm font-semibold">
          $6.8K
        </div>
        <div className="absolute top-[30px] left-[30px] text-sm font-semibold">
          $9.3K
        </div>
        <div className="absolute top-[10px] left-[10px] text-sm font-semibold">
          $14K
        </div>
      </div>
    </div>
  );
}
