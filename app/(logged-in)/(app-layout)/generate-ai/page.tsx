"use client";

import SavingButton from "@/app/components/goals/saving-button";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ValidationError {
  isValid: boolean;
  validationError?: string;
}

interface PlanStep {
  title: string;
  emoji: string;
  description: string;
  startedTime: string; // Change from startDate
  endTime: string; // Change from endDate
  percentComplete: string;
}

interface GoalData {
  title: string;
  emoji: string;
  description: string;
  startDate: string;
  endDate: string;
  steps: PlanStep[];
}

interface PlanData {
  dataGoals: GoalData;
  message: string;
  error: string | null;
  isLastMessage: boolean;
}

interface ApiResponse {
  content: string;
  planData: PlanData | null;
  jsonError: string | null;
  history: Message[];
  error?: string;
  message?: string;
}

export default function GoalPlanner() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [previousResponse, setPreviousResponse] =
    useState<ValidationError | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = useCallback(async () => {
    setConversationStarted(true);
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAnswer: null,
          conversationHistory: [],
          previousResponse: null,
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.message || "An error occurred");
      }

      // Filter out any JSON code blocks from messages for display
      const cleanedHistory = data.history.map((msg) => ({
        ...msg,
        content:
          msg.role === "assistant"
            ? removeJsonCodeBlock(msg.content)
            : msg.content,
      }));

      setMessages(cleanedHistory || []);
      setPlanData(data.planData);

      // Handle validation errors if present
      if (data.error && data.message) {
        setPreviousResponse({
          isValid: false,
          validationError: data.message,
        });
      } else {
        setPreviousResponse(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm your Goal Planner Assistant. I'll help you break down your goals into actionable steps. What goal would you like to work on today?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Start the conversation automatically when component mounts
  useEffect(() => {
    if (!conversationStarted) {
      startConversation();
    }
  }, [conversationStarted, startConversation]);

  // Helper function to remove JSON code blocks from messages
  const removeJsonCodeBlock = (content: string) => {
    return content.replace(/```json[\s\S]*?```/g, "");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage = input;
    setInput("");
    setMessages([...messages, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAnswer: userMessage,
          conversationHistory: messages,
          previousResponse: previousResponse,
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.error) {
        // Set validation error information if present
        setPreviousResponse({
          isValid: false,
          validationError: data.message || "An error occurred",
        });
        throw new Error(data.message || "An error occurred");
      }

      // Check for JSON parsing errors
      if (data.jsonError) {
        console.warn("JSON parsing error:", data.jsonError);
      }

      // Filter out any JSON code blocks from messages for display
      const cleanedHistory = data.history.map((msg) => ({
        ...msg,
        content:
          msg.role === "assistant"
            ? removeJsonCodeBlock(msg.content)
            : msg.content,
      }));

      // Reset previous response when successful
      setPreviousResponse(null);
      setMessages(cleanedHistory || []);
      setPlanData(data.planData);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...messages,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format message content with line breaks
  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  // Format date and time for display
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return dateTimeStr; // Return the original string if parsing fails
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-xl font-bold">Goal Planner Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === "user" ? "bg-blue-100 ml-auto" : "bg-white"
            } p-4 rounded-lg shadow max-w-3xl ${
              message.role === "user" ? "ml-12" : "mr-12"
            }`}
          >
            <div className="font-medium mb-1">
              {message.role === "user" ? "You" : "Goal Assistant"}
            </div>
            <div className="text-gray-800">
              {formatMessage(message.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-white p-4 rounded-lg shadow max-w-3xl mr-12">
            <div className="font-medium mb-1">Goal Assistant</div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        {planData &&
          planData.dataGoals &&
          planData.dataGoals.steps &&
          planData.dataGoals.steps.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200 max-w-3xl mr-12">
              <h3 className="font-bold text-lg mb-2">Your Goal Plan</h3>
              <div className="mb-3">
                <div className="font-semibold">Title:</div>
                <div>
                  {planData.dataGoals.emoji}
                  {planData.dataGoals.title}
                </div>
              </div>

              <div className="mb-3">
                <div className="font-semibold">Description:</div>
                <div>{planData.dataGoals.description}</div>
              </div>

              <div className="mb-3">
                <div className="font-semibold">Timeline:</div>
                <div>
                  {planData.dataGoals.startDate} to {planData.dataGoals.endDate}
                </div>
              </div>

              <div className="mb-3">
                <div className="font-semibold">Steps:</div>
                <ul className="list-disc pl-5 space-y-2">
                  {planData.dataGoals.steps.map((step, idx) => (
                    <li
                      key={idx}
                      className="border-b border-green-100 pb-2 last:border-b-0"
                    >
                      <div className="font-medium">
                        {step.emoji}
                        {step.title}
                      </div>
                      <div className="text-sm mb-1">{step.description}</div>
                      <div className="text-xs text-gray-600">
                        {formatDateTime(step.startedTime)} to{" "}
                        {formatDateTime(step.endTime)}
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: step.percentComplete }}
                          ></div>
                        </div>
                        <div className="text-xs text-right mt-1">
                          {step.percentComplete}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-gray-500 mt-4">
                {planData.message}
              </div>
              <div>
                <SavingButton planData={planData} />
              </div>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || input.trim() === ""}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
