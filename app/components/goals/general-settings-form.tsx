"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
import { Loader } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not be longer than 160 characters.",
    }),
});

export function GeneralSettingsForm() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Fetch existing goal data
  useEffect(() => {
    async function fetchGoal() {
      if (!params.id) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/goals/${params.id}/settings`);

        if (!res.ok) {
          throw new Error(`Error fetching goal: ${res.status}`);
        }

        const goal = await res.json();

        // Update form with existing values
        form.reset({
          title: goal.title,
          description: goal.description,
        });
      } catch (err) {
        console.error("Failed to fetch goal:", err);
        setError("Failed to load goal data");
      } finally {
        setLoading(false);
      }
    }

    fetchGoal();
  }, [params.id, form]);

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!params.id) return;

    try {
      setSubmitting(true);

      const res = await fetch(`/api/goals/${params.id}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update goal");
      }

      // No need to store the result if we're not using it
      await res.json();

      toast.success("Goal updated successfully!");
      // Optionally redirect back to the goal view
      router.refresh();
      router.push(`/goals/${params.id}/overview`);
    } catch (err) {
      console.error("Error updating goal:", err);
      toast.error(
        "Failed to update goal: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2">Loading goal data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-200 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Meetings" {...field} />
              </FormControl>
              <FormDescription>Title for your goal</FormDescription>
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
                  placeholder="Tell us about your goal"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Goal"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
