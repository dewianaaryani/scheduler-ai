// app/page.tsx
"use client";

import GoalForm from "@/app/components/scheduler/goal-form";
import { useEffect, useState } from "react";

export default function AiPage() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // You would typically get this from your auth system
    // For now, we'll use a placeholder
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        console.log(data);

        setUsername(data.name);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex w-full h-full">
      <GoalForm username={username} />
    </div>
  );
}
