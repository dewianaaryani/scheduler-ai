"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ✅ Import Card components

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image: z.any().optional(), // image tidak wajib
});

export default function AccountSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe", // contoh default name
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, image } = values;

    const formData = new FormData();
    formData.append("name", name);

    // hanya kirim file image jika user memilih file baru
    if (image instanceof File) {
      formData.append("image", image);
    }

    fetch("/api/account", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Success:", data))
      .catch((err) => console.error("❌ Error:", err));
  }

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-md rounded-sm">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormDescription>Upload your profile picture</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
