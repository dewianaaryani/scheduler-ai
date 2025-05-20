// components/emoji-picker.tsx
"use client";
import { useState } from "react";
import { emojiList } from "@/app/lib/emoji-list";
import { Button } from "@/components/ui/button";

export function EmojiPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (emoji: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="text-2xl h-12 w-12 p-0"
        onClick={() => setShowPicker(!showPicker)}
      >
        {value || "📤"}
      </Button>

      {showPicker && (
        <div className="absolute top-14 z-50 bg-white border rounded-md p-2 shadow-md w-[300px] max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {emojiList.map((emoji) => (
              <button
                key={emoji.emoji}
                type="button"
                className="h-10 w-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(emoji.emoji);
                  setShowPicker(false); // close after selecting
                }}
              >
                {emoji.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
