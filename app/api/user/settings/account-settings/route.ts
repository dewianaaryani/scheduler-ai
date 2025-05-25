// app/api/user/settings/account-settings/route.ts

import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextResponse } from "next/server";

// GET - untuk mengambil data user
export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return NextResponse.json({
    name: user?.name || "",
    profileImage: user?.image || null,
  });
}

// POST - untuk update data user
export async function POST(req: Request) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, profileImage } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name,
        image: profileImage,
      },
    });

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
