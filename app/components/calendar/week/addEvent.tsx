"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CalendarPlus } from "lucide-react";
import FormEvent from "./formEvent";

interface AddEventProps {
  onEventAdded?: () => void;
}

export function AddEvent({ onEventAdded }: AddEventProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7C5CFC] hover:bg-[#6A4AE8]">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Tambah Jadwal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          <DialogDescription>
            Buat acara baru di jadwalmu. Isi detail di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <FormEvent setOpen={setOpen} onEventAdded={onEventAdded} />
      </DialogContent>
    </Dialog>
  );
}
