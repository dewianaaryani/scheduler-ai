"use client";

import { useState, useEffect } from "react";

interface DateCounterProps {
  date: string | Date;
  title?: string;
  emoji?: string;
  className?: string;
}

const DateCounter: React.FC<DateCounterProps> = ({
  date,
  title,
  emoji,
  className = "",
}) => {
  const [displayMessage, setDisplayMessage] = useState<string>("");
  const [colorClass, setColorClass] = useState<string>("text-gray-500");

  useEffect(() => {
    // Calculate and format date difference
    const calculateDateDifference = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const diffTime: number = targetDate.getTime() - now.getTime();
      const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Set message based on difference
      let message: string;
      if (diffDays === 0) {
        message = "Today!";
        setColorClass("text-purple-600");
      } else if (diffDays === 1) {
        message = "Tomorrow";
        setColorClass("text-orange-500");
      } else if (diffDays === -1) {
        message = "Yesterday";
        setColorClass("text-gray-500");
      } else if (diffDays > 0) {
        message = `In ${diffDays} days`;
        setColorClass(diffDays <= 3 ? "text-orange-500" : "text-blue-500");
      } else {
        message = `${Math.abs(diffDays)} days ago`;
        setColorClass("text-gray-500");
      }

      setDisplayMessage(message);
    };

    calculateDateDifference();

    // Update daily
    const interval = setInterval(calculateDateDifference, 1000 * 60 * 60 * 12);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className={`flex items-center ${className}`}>
      {emoji && (
        <div className="flex-shrink-0 border p-2 rounded-md mr-3">
          <span className="text-xl">{emoji}</span>
        </div>
      )}
      <div className="flex flex-col">
        {title && (
          <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        )}
        <p className={`text-sm font-medium ${colorClass}`}>
          {displayMessage || "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default DateCounter;
