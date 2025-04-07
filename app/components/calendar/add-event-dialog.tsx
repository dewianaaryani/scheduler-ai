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
import { formSchema } from "./event-schema";

export type FormValues = z.infer<typeof formSchema>;

export function AddEventDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startedTime: undefined, // Ensure that startedTime has a valid default
      endTime: undefined, // You may also want to set a default for endTime
      icon: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          // Schedule conflict error
          toast.error("Konflik jadwal: " + data.message, {
            description: "Silakan pilih waktu yang berbeda.",
            duration: 5000,
          });
          return;
        }

        // Handle other errors
        toast.error("Gagal membuat jadwal: " + data.message);
        return;
      }
      // Success case
      toast.success("Jadwal berhasil dibuat!", {
        description: "Jadwal baru telah ditambahkan ke kalender Anda.",
      });
      form.reset();
      setOpen(false); // Close dialog on success
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan saat menyimpan jadwal.");
    }
  }
  // Handler for canceling/closing the dialog
  const handleCancel = () => {
    setOpen(false);
  };
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
        <EventForm form={form} onSubmit={onSubmit} onCancel={handleCancel} />
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
