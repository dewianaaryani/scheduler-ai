"use client";
import React, { useState } from "react";
import { formSchema } from "../event-schema";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { EmojiPicker } from "../emoji-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { id } from "date-fns/locale";

type FormValues = z.infer<typeof formSchema>;

interface FormEventProps {
  setOpen: (open: boolean) => void;
  onEventAdded?: () => void;
}

export default function FormEvent({ setOpen, onEventAdded }: FormEventProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      startTime: format(new Date(), "HH:mm"),
      endTime: format(addMinutes(new Date(), 60), "HH:mm"),
      emoji: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: FormValues) {
    // Prevent double submission
    if (isSubmitting) return;

    const { title, description, date, startTime, endTime, emoji } = values;

    if (!date) return;

    const start = new Date(`${format(date, "yyyy-MM-dd")}T${startTime}:00`);
    const end = new Date(`${format(date, "yyyy-MM-dd")}T${endTime}:00`);

    const payload = {
      title,
      description,
      emoji,
      startedTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Terjadi kesalahan");
        return;
      }
      toast.success("Jadwal berhasil dibuat!");
      setOpen(false);

      // Call the callback to refresh the calendar
      if (onEventAdded) {
        onEventAdded();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="flex flex-col max-h-[80vh] sm:max-h-[60vh]">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 pb-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <EmojiPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <span className="text-sm text-gray-500">
                      Pilih emoji untuk acaramu
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Judul acara"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Maksimal 100 karakter ({field.value.length}/100)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi acara"
                    className="resize-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Maksimal 500 karakter ({field.value?.length || 0}/500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal justify-start",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "PPPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      className=""
                      locale={id}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Waktu Mulai</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Clock className="absolute left-3 h-4 w-4 text-gray-500 pointer-events-none z-10" />
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={isSubmitting}
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Waktu Selesai</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Clock className="absolute left-3 h-4 w-4 text-gray-500 pointer-events-none z-10" />
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={isSubmitting}
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          </form>
        </Form>
      </div>
      <div className="px-2 pt-4 border-t">
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-[#7C5CFC] hover:bg-[#6A4AE8]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menambahkan...
              </>
            ) : (
              "Tambah Acara"
            )}
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
}
