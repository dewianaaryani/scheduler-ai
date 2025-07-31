import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function NavButtons() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Button
        asChild
        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0"
      >
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}
