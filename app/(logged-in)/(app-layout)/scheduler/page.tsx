/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot } from "lucide-react";

export default function Page() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Collected goal data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [recurrence, setRecurrence] = useState("");
  const [steps, setSteps] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          title,
          description,
          startDate,
          endDate,
          recurrence,
        }),
      });

      const data = await res.json();
      console.log("Claude raw response:", data); // Debug

      if (!res.ok) {
        throw new Error(data?.error || "Unknown server error");
      }

      const newData = data?.newData || {};
      if (newData.title) setTitle(newData.title);
      if (newData.description) setDescription(newData.description);
      if (newData.startDate) setStartDate(newData.startDate);
      if (newData.endDate) setEndDate(newData.endDate);

      // Recurrence validation
      const validRecurrence = ["NONE", "DAILY", "WEEKLY", "MONTHLY"];
      const newRecurrence = newData.recurrence?.toUpperCase();
      if (validRecurrence.includes(newRecurrence)) {
        setRecurrence(newRecurrence);
      }

      if (data?.steps) {
        setSteps(data.steps);
      }

      setResponse(data.followUp || "All set!");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-start p-6">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-black tracking-tight">
            What Can I Help You Today?{" "}
            <span className="text-yellow-400">✨</span>
          </h1>
          <p className="text-gray-600">
            Setup your productivity with Kalana 😊
          </p>
        </div>

        {/* Display current goal data */}
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <strong>Title:</strong> {title || "Not set"}
          </p>
          <p>
            <strong>Description:</strong> {description || "Not set"}
          </p>
          <p>
            <strong>Start Date:</strong> {startDate || "Not set"}
          </p>
          <p>
            <strong>End Date:</strong> {endDate || "Not set"}
          </p>
          <p>
            <strong>Recurrence:</strong> {recurrence || "Not set"}
          </p>
        </div>

        {/* Input text area */}
        <Textarea
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        {/* Send button */}
        <Button onClick={sendMessage} disabled={loading} className="w-full">
          {loading ? "Thinking..." : "Send"}
        </Button>

        {/* Claude follow-up message */}
        {response && (
          <Card className="p-4 bg-gray-100 text-black whitespace-pre-line">
            <strong className="flex items-center gap-2">
              AI
              <Bot />:
            </strong>{" "}
            {response}
          </Card>
        )}

        {/* Steps if all data is filled */}
        {steps.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">🪄 Your Goal Plan:</h2>
            {steps.map((step, index) => (
              <Card key={index} className="p-4 bg-white">
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
                <p className="text-sm text-gray-500">{step.timeline}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
