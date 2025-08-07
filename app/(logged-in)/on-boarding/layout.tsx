import { requireUser } from "@/app/lib/hooks";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";

async function checkOnboardingStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      preferences: true,
    },
  });
  
  // If user already has preferences, redirect to dashboard
  if (user?.preferences) {
    redirect("/dashboard");
  }
  
  return user;
}

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  await checkOnboardingStatus(session.id as string);
  
  return <>{children}</>;
}