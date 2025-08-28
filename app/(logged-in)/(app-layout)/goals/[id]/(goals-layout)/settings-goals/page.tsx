"use client";

import { GeneralSettingsForm } from "@/app/components/goals/general-settings-form";
import React, { use, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Goal } from "@/app/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [goal, setGoal] = useState<Goal | null>(null); // Store the goal data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const router = useRouter();

  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch(`/api/goals/${id}`);
        if (res.ok) {
          const data = await res.json();
          setGoal(data);
        } else {
          console.error("Failed to fetch goal data");
        }
      } catch (error) {
        console.error("Error fetching goal data:", error);
      }
    }
    fetchGoal();
  }, [id]);

  const handleAbandonGoal = async () => {
    setIsSubmitting(true);
    setIsLoading(true); // Start loading spinner

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Tujuan berhasil dibatalkan!");

        // Simulate delay before redirecting to show loading spinner
        setTimeout(() => {
          router.push(`/goals/${id}/overview`);
        }, 1500); // Adjust time delay for the user to see the loading spinner
      } else {
        toast.error("Gagal membatalkan tujuan.");
      }
    } catch (error) {
      console.error("Error abandoning goal:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // End loading spinner
    }
  };

  // If goal data is still loading, show skeleton loader
  if (!goal) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 px-4">
        <Skeleton className="h-6 w-48" /> {/* Skeleton for title */}
        <Skeleton className="h-4 w-full max-w-xs" /> {/* Skeleton for description */}
        {/* Skeleton for the general settings section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        {/* Skeleton for the abandonment section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 px-4">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold">Pengaturan Tujuan</h2>
        <p className="text-sm sm:text-base text-gray-500">
          Kelola pengaturan tujuan Anda di sini.
        </p>
      </div>
      
      {/* General Settings Section */}
      <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="font-semibold text-sm sm:text-base">Pengaturan Umum</h4>
        </div>
        <div className="p-4">
          <GeneralSettingsForm />
        </div>
      </div>
      
      {/* Abandon Goal Section */}
      {goal.status !== "ABANDONED" && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm sm:text-base">Tujuan yang Dibatalkan</h4>
          <Alert
            variant="destructive"
            className="border-red-500 p-3 sm:p-4"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="space-y-1">
                  <AlertTitle className="text-sm sm:text-base leading-tight">
                    Membatalkan tujuan berarti Anda akan kehilangan kendali atasnya.
                  </AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm leading-relaxed">
                    Pastikan Anda tidak lagi memerlukan tujuan ini sebelum melanjutkan.
                  </AlertDescription>
                </div>
                
                {/* AlertDialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Batalkan Tujuan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                    <AlertDialogHeader className="space-y-2">
                      <AlertDialogTitle className="text-base sm:text-lg">
                        Apakah Anda yakin?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm">
                        Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen membatalkan
                        tujuan Anda.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                      <AlertDialogCancel 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button 
                          onClick={handleAbandonGoal} 
                          disabled={isSubmitting}
                          variant="destructive"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                          {isSubmitting ? "Memproses..." : "Ya, Batalkan"}
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Display a loading spinner while redirecting */}
      {isLoading && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 sm:border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500">Mengalihkan...</span>
        </div>
      )}
    </div>
  );
}