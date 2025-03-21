"use client";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle2Icon } from "lucide-react";
import { useFormStatus } from "react-dom";

export function AuthButton({ provider }: { provider: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 animate-spin" /> Loading
        </Button>
      ) : (
        <Button variant="outline" className="w-full gap-2">
          <UserCircle2Icon /> Login with {provider}
        </Button>
      )}
    </>
  );
}
