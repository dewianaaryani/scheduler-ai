import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { Button } from "@/components/ui/button";

export default function AbandonedGoals() {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-md">Abandoned Goals</h4>
      <Alert
        variant="destructive"
        className="border-red-500 flex items-center justify-between py-4"
      >
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6" />
          <div className="ml-3">
            <AlertTitle>
              Abandoning the goal means you will lose control over it.
            </AlertTitle>
            <AlertDescription>
              Make sure you no longer need this goal before proceeding.
            </AlertDescription>
          </div>
        </div>
        <Button className="mt-2" variant="destructive" size="sm">
          Abandoned
        </Button>
      </Alert>
    </div>
  );
}
