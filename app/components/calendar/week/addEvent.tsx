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

export function AddEvent() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7C5CFC] hover:bg-[#6A4AE8]">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event in your schedule. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <FormEvent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
