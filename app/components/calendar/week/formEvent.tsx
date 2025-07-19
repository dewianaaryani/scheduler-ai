"use client";
import React from "react";
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
import { CalendarIcon, Clock } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { EmojiPicker } from "../emoji-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof formSchema>;

export default function FormEvent({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
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
  const router = useRouter();

  // Handle form submission
  async function onSubmit(values: FormValues) {
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
        toast.error(errorData.message);
        return;
      }
      toast.success("Schedule created successfully!");
      setOpen(false);
      router.push("/calendar");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
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
    <div className="overflow-y-auto max-h-[60vh] px-2">
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
                      Select an emoji for your event
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum 100 characters ({field.value.length}/100)
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Event description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Maximum 500 characters ({field.value?.length || 0}/500)
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
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      className=""
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {[
              ["startTime", "Start Time"],
              ["endTime", "End Time"],
            ].map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as "startTime" | "endTime"}
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between min-h-[100px]">
                    <div className="">
                      <FormLabel className="mb-2">{label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <Clock className="absolute right-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <hr className="w-full" />
          <DialogFooter className="">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#7C5CFC] hover:bg-[#6A4AE8]">
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
