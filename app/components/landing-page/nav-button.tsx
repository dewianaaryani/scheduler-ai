import { Button } from "@/components/ui/button";
import React from "react";
import { AuthModal } from "../AuthModal";

export default function NavButtons() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <AuthModal />
      <Button variant="ghost" className="text-gray-700 hover:text-violet-700">
        Log in
      </Button>
      <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0">
        Get Started
      </Button>
    </div>
  );
}
