import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { IconSelector } from "./icon-selector";
import { FormValues } from "./add-event-dialog";
import { useForm } from "react-hook-form";
import { TextFormField } from "./form/text-form-field";
import { TimePicker } from "./form/time-selector";

export type EventFormProps = {
  form: ReturnType<typeof useForm<FormValues>>;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  exsitingSchedules?: Array<{
    id: string;
    title: string;
    description: string;
    startedTime: Date;
    endTime: Date;
  }>;
};

export function EventForm({
  form,
  onSubmit,
  onCancel,
  exsitingSchedules = [],
}: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Check for conflicts when time changes
  const checkForConflicts = (startedTime: Date, endTime: Date) => {
    if (!startedTime || !endTime || !exsitingSchedules?.length) {
      setConflictWarning(null);
      return;
    }
    const conflicts = exsitingSchedules.filter((schedule) => {
      return (
        startedTime < new Date(schedule.endTime) &&
        endTime > new Date(schedule.startedTime)
      );
    });
    if (conflicts.length > 0) {
      setConflictWarning(
        `Jadwal ini bertabrakan dengan "${conflicts[0].title}" dan ${
          conflicts.length > 1 ? `${conflicts.length - 1} jadwal lainnya` : ""
        }`
      );
    } else {
      setConflictWarning(null);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          id="event-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-5 overflow-y-auto"
        >
          <TextFormField
            control={form.control}
            name="title"
            label="Title"
            placeholder="Meetings with Clients"
          />
          <TextFormField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Disscuss all things design"
          />
          <FormField
            control={form.control}
            name="startedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={(date) => form.setValue("startedTime", date)}
                    showCalendar={true}
                    placeholder="MM/DD/YYYY hh:mm aa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value}
                    onChange={(date) => form.setValue("endTime", date)}
                    showCalendar={true}
                    placeholder="Select End Time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <IconSelector
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
