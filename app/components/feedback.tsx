"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedbackCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Review rating</p>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="text-lg font-semibold">
        How is your goal management going?
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${
                rating === 5 ? "border-orange-500 text-orange-500" : ""
              }`}
            >
              {rating === 1
                ? "😞"
                : rating === 2
                ? "😐"
                : rating === 3
                ? "😊"
                : rating === 4
                ? "😄"
                : "😍"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
