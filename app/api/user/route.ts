import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  return NextResponse.json(user);
}
