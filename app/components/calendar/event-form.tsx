import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TimePicker } from "./form/time-selector"; // Make sure this path is correct
import EmojiSelect from "../emoji-selector";

// Define your schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startedTime: z.date({
    required_error: "Please select a start time",
  }),
  endTime: z.date({
    required_error: "Please select an end time",
  }),
  emoji: z.string().optional(),
});
interface EventFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  exsitingSchedules: {
    id: string;
    title: string;
    description: string;
    startedTime: Date;
    endTime: Date;
  }[];
}
// Form values type
export type FormValues = z.infer<typeof formSchema>;

export function EventForm({
  form,
  onSubmit,
  onCancel,
  exsitingSchedules,
}: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values for debugging
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startedTime: undefined,
      endTime: undefined,
      emoji: undefined,
    },
  });

  // Log form values when they change - helpful for debugging
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted with values:", values);
    // Process form submission here
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Form submitted with values: " + JSON.stringify(values, null, 2));
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Event Form (Debug Version)</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Time field */}
          <FormField
            control={form.control}
            name="startedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={(date) => {
                      console.log("TimePicker onChange - Start Time:", date);
                      field.onChange(date);
                    }}
                    showCalendar={true}
                    placeholder="Select start date and time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time field */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={(date) => {
                      console.log("TimePicker onChange - End Time:", date);
                      field.onChange(date);
                    }}
                    showCalendar={true}
                    placeholder="Select end date and time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emoji field */}
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <FormControl>
                  <EmojiSelect
                    value={field.value}
                    onChange={(emoji) => {
                      console.log("EmojiSelect onChange:", emoji);
                      field.onChange(emoji);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form debug info */}
          <div className="bg-gray-100 p-4 rounded-md text-sm">
            <h3 className="font-bold mb-2">Form State (Debug):</h3>
            <div>
              <strong>Form Errors:</strong>{" "}
              {JSON.stringify(form.formState.errors, null, 2)}
            </div>
            <div className="mt-2">
              <strong>Current Values:</strong>
              <pre className="bg-gray-200 p-2 rounded mt-1 overflow-auto max-h-40">
                {JSON.stringify(form.getValues(), null, 2)}
              </pre>
            </div>
          </div>

          {/* Submit button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
