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
import { IconSelector } from "./icon-selector";
import { FormValues } from "./add-event-dialog";
import { useForm } from "react-hook-form";
import { TextFormField } from "./form/text-form-field";
import { TimePicker } from "./form/time-selector";
import { AlertCircle } from "lucide-react";

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
      return false;
    }

    const conflicts = exsitingSchedules.filter((schedule) => {
      return (
        startedTime < new Date(schedule.endTime) &&
        endTime > new Date(schedule.startedTime)
      );
    });

    if (conflicts.length > 0) {
      let warningMessage = `Jadwal ini bertabrakan dengan "${conflicts[0].title}"`;

      // Only add additional text if there's more than one conflict
      if (conflicts.length > 1) {
        warningMessage += ` dan ${conflicts.length - 1} jadwal lainnya`;
      }

      setConflictWarning(warningMessage);
      return true;
    } else {
      setConflictWarning(null);
      return false;
    }
  };

  // Handle form submission with conflict checking
  const handleSubmit = async (values: FormValues) => {
    // Check for conflicts before submitting
    if (values.startedTime && values.endTime) {
      const hasConflict = checkForConflicts(values.startedTime, values.endTime);
      if (hasConflict) {
        // Don't submit if there's a conflict
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          id="event-form"
          onSubmit={form.handleSubmit(handleSubmit)}
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
                    onChange={(date) => {
                      form.setValue("startedTime", date);
                      // Check for conflicts when start time changes
                      if (date && form.getValues("endTime")) {
                        checkForConflicts(date, form.getValues("endTime"));
                      }
                    }}
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
                    onChange={(date) => {
                      form.setValue("endTime", date);
                      // Check for conflicts when end time changes
                      if (date && form.getValues("startedTime")) {
                        checkForConflicts(form.getValues("startedTime"), date);
                      }
                    }}
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

          {/* Conflict warning message */}
          {conflictWarning && (
            <div className="col-span-2 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{conflictWarning}</p>
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !!conflictWarning}>
              {isSubmitting ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
