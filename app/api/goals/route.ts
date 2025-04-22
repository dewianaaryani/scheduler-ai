/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/goals.ts
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const goals = await prisma.goal.findMany(); // Adjust the model name if needed
    return NextResponse.json(goals); // Return the goals as JSON
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}
