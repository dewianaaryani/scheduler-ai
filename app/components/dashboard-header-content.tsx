"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";

export default function DashboardHeaderContent() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64 h-10 bg-gray-200 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="mb-6">
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

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
              {data?.header.today}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={data?.header.user.avatar ?? "/placeholder.svg"}
                alt="profile"
              />
              <AvatarFallback>
                {data?.header.user.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold">
                {data?.header.user.name ?? "..."}
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
                Hai {data?.header.user.name?.split(" ")[0] ?? "Pengguna"}! 👋
              </h2>
              <p className="text-sm text-muted-foreground">
                {data?.header.user.message ??
                  "Kamu telah menaburkan kerja keras, menambahkan tekad, dan sekarang kamu menyajikan kesuksesan yang luar biasa!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
