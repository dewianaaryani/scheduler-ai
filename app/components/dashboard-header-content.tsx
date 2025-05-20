"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SearchCommand from "./search-command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { format } from "date-fns";

type DashboardData = {
  today: string;
  user: {
    name: string | null;
    avatar: string;
    message: string;
  };
};

export default function DashboardHeaderContent() {
  const today = format(new Date(), "EEEE, dd MMMM yyyy");

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/dashboard/header");
        if (!res.ok) throw new Error("Unauthorized or error fetching data");

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">
        {/* Kiri: Tanggal & Sapaan */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-violet-100 hover:bg-violet-200"
          >
            <Target className="h-6 w-6 text-violet-600" />
            <span className="sr-only">Menu</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-violet-500 tracking-tight">
              {today}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <SearchCommand />
          </div>

          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={data?.user.avatar ?? "/placeholder.svg"}
                alt="profile"
              />
              <AvatarFallback>
                {data?.user.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold">
                {data?.user.name ?? "..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Card className="bg-gradient-to-r from-violet-100 to-violet-200 border-none rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Hai {data?.user.name?.split(" ")[0] ?? "User"}! 👋
              </h2>
              <p className="text-sm text-muted-foreground">
                {data?.user.message ??
                  "You sprinkled hard work, topped it with determination, and now you’re serving up a big ol’ sundae of success!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
