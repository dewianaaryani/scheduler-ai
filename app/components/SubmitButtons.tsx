"use client";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle2Icon } from "lucide-react";
import { useFormStatus } from "react-dom";

interface AuthButtonProps {
  provider: string;
  onClick: () => void; // Accept onClick prop
}

export function AuthButton({ provider, onClick }: AuthButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 animate-spin" /> Memuat
        </Button>
      ) : (
        <Button variant="outline" className="w-full gap-2" onClick={onClick}>
          <UserCircle2Icon /> Login with {provider}
        </Button>
      )}
    </>
  );
}
