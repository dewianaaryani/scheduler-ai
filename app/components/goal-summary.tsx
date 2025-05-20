"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoalSummary() {
  const categories = [
    { id: 1, name: "Bank loans", icon: "🏦", color: "bg-orange-500" },
    { id: 2, name: "Accounting", icon: "📊", color: "bg-blue-500" },
    { id: 3, name: "HR management", icon: "👥", color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${category.color} text-white`}
          >
            <span>{category.icon}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{category.name}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="rounded-xl bg-orange-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <span className="text-xl">☀️</span>
            </div>
            <p className="font-medium">Wallet Verification</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Enable 2-step verification to secure your wallet.
        </p>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Enable
        </Button>
      </div>
    </div>
  );
}
