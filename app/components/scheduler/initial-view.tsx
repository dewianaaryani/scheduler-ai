// components/goal/initial-view.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import SuggestionList from "./suggestion-list";

interface InitialViewProps {
  username: string;
  onSubmit: (value: string) => void;
}

export default function InitialView({ username, onSubmit }: InitialViewProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex w-full h-full justify-center items-start pt-10">
      <div className="flex-col h-full max-w-3xl justify-between items-center w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Hi There, {username}!
            <br />
            What Can I Help You Today?{" "}
            <span className="text-yellow-400">✨</span>
          </h1>
          <p className="text-md text-gray-600">
            Setup your productivity with Kalana 😊
          </p>
        </div>

        <div className="flex gap-4 w-full items-center">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm">
              Here are suggestions for your goals based on your previous
              activities
            </h2>

            <SuggestionList onSelectSuggestion={onSubmit} />
          </div>
        </div>

        <div className="relative w-full">
          <Textarea
            className="pr-20 min-h-[100px]"
            placeholder="I want to..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="sm"
            className="absolute bottom-2 right-2 rounded-md"
            onClick={handleSubmit}
            type="button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
