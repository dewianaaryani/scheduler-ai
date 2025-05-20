import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import React from "react";
import { ProgressChart } from "./progress-chart";
import { ActivityManager } from "./activity-manager";
import { GoalSummary } from "./goal-summary";
import { FeedbackCard } from "./feedback";

export default function DashboardMainContent() {
  return (
    <div>
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 row-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progress Tahunan</h3>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                2023 <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <ProgressChart />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Activity Manager</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Filters
                </Button>
              </div>
            </div>
            <ActivityManager />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Business Plans</h3>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <GoalSummary />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <FeedbackCard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
