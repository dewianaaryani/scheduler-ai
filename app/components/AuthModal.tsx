import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "../lib/auth";
import { AuthButton } from "./SubmitButtons";
import { redirect } from "next/navigation";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Login</DialogTitle>

        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              ("use server");
              await signIn("google");
              redirect("/dashboard"); // Redirect after successful login
            }}
            className="w-full"
          >
            <AuthButton provider="Google" />
          </form>

          <form
            action={async () => {
              ("use server");
              await signIn("github");
              redirect("/dashboard"); // Redirect after successful login
            }}
            className="w-full"
          >
            <AuthButton provider="Github" />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
