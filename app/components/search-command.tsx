"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger (can be replaced with button or icon) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 w-[200px] rounded-full border px-3 py-2 text-sm text-muted-foreground hover:border-primary"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Cari...</span>
        <kbd className="ml-auto text-[10px] text-muted-foreground">Ctrl+K</kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari sesuatu..." />
        <CommandList>
          <CommandEmpty>Tidak ditemukan.</CommandEmpty>

          <CommandGroup heading="Goals">
            <CommandItem onSelect={() => handleSelect("/goals/1")}>
              Belajar React
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("/goals/2")}>
              Bangun Dashboard
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Jadwal">
            <CommandItem onSelect={() => handleSelect("/schedules/1")}>
              Meeting 10:00
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("/schedules/2")}>
              Diskusi UI/UX
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
