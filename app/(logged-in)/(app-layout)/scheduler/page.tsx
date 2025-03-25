"use client"; // Required for client-side interactivity

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      // Extract the text response
      setResponse(data?.content?.[0]?.text || "No response from Claude");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center p-6">
      <div className="max-w-3xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-black tracking-tight">
            What Can I Help You Today?{" "}
            <span className="text-yellow-400">✨</span>
          </h1>
          <p className="text-gray-600">
            Setup your productivity with Kalana 😊
          </p>
        </div>

        <Textarea
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />

        <Button onClick={sendMessage} disabled={loading} className="w-full">
          {loading ? "Thinking..." : "Send"}
        </Button>

        {response && (
          <Card className="p-4 bg-gray-100 text-black">
            <strong>Claude:</strong> {response}
          </Card>
        )}
      </div>
    </div>
  );
}
