// components/goal/suggestion-list.tsx
"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suggestion } from "@/app/lib/types";
import { fetchSuggestions } from "@/app/lib/goal-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SuggestionListProps {
  onSelectSuggestion: (suggestion: string) => void;
}

export default function SuggestionList({
  onSelectSuggestion,
}: SuggestionListProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSuggestions();
      setSuggestions(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Suggestion Fetch Error:", err);
      setError(err.message);
      toast("Couldn't load suggestions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Memuat suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSuggestions}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() =>
              onSelectSuggestion(`${suggestion.emoji} ${suggestion.title}`)
            }
            className="relative flex flex-col p-4 border shadow-sm hover:shadow-xl rounded-sm items-start text-left w-full transition-all duration-200"
          >
            <p className="text-sm font-semibold">{suggestion.title}</p>
            <div className="mt-auto self-end text-xl">{suggestion.emoji}</div>
          </button>
        ))
      ) : (
        <p className="text-sm text-gray-500 p-4">
          No suggestions available. Start by creating your first goal!
        </p>
      )}
    </div>
  );
}
