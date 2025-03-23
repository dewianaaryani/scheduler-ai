"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react"; // Import from next-auth/react
import { AuthButton } from "./SubmitButtons";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Login</DialogTitle>

        <div className="flex flex-col gap-4">
          <AuthButton provider="Google" onClick={() => signIn("google")} />
          <AuthButton provider="Github" onClick={() => signIn("github")} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
