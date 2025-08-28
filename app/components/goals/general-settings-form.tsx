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
      message: "Judul minimal 2 karakter.",
    })
    .max(100, {
      message: "Judul maksimal 100 karakter.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Deskripsi minimal 10 karakter.",
    })
    .max(500, {
      message: "Deskripsi maksimal 500 karakter.",
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
        setError("Gagal memuat data tujuan");
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
        throw new Error(error.message || "Gagal memperbarui tujuan");
      }

      // No need to store the result if we're not using it
      await res.json();

      toast.success("Tujuan berhasil diperbarui!");
      // Optionally redirect back to the goal view
      router.refresh();
      router.push(`/goals/${params.id}/overview`);
    } catch (err) {
      console.error("Error updating goal:", err);
      toast.error(
        "Gagal memperbarui tujuan: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-sm sm:text-base">Memuat data tujuan...</span>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Judul</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: Belajar bahasa baru" 
                  className="text-sm sm:text-base"
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-xs sm:text-sm">Judul untuk tujuan Anda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ceritakan tentang tujuan Anda"
                  className="resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {submitting ? (
              <>
                <Loader className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Memperbarui...
              </>
            ) : (
              "Perbarui Tujuan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
