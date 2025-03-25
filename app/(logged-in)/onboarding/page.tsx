import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-4 text-center">
      <h1 className="font-bold text-4xl text-black">
        Let’s start your{" "}
        <span className="underline decoration-purple-500">personalization</span>
        !
      </h1>
      <Button className="px-10 py-5 shadow-md">
        <Link href="/onboarding/preferences">Get Started</Link>
      </Button>
    </div>
  );
}
