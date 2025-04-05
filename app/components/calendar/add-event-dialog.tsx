import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { EventForm } from "./event-form";

export const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    startedTime: z.date({
      required_error: "A date and time is required.",
    }),
    endTime: z.date({
      required_error: "A date and time is required.",
    }),
    icon: z.string().min(1, {
      message: "Icon must be choosen",
    }),
  })
  .superRefine(({ startedTime, endTime }, ctx) => {
    if (startedTime && endTime) {
      const diffInMilliseconds = endTime.getTime() - startedTime.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // Konversi ke jam

      if (diffInHours < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be at least 1 hour after start time",
          path: ["endTime"],
        });
      }
    }
  });

export function AddEventDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startedTime: undefined, // Ensure that startedTime has a valid default
      endTime: undefined, // You may also want to set a default for endTime
      icon: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      toast.success("Event berhasil ditambahkan!");
      form.reset(); // Reset form setelah submit berhasil
      setOpen(false); // Tutup dialog setelah sukses
    } else {
      toast.error("Gagal menambahkan event");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>
            Create New Event to your Calendar
          </DialogDescription>
        </DialogHeader>
        <EventForm form={form} onSubmit={onSubmit} />
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="event-form">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
