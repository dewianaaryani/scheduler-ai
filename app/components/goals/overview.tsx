import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Loader } from "lucide-react";
import React from "react";

export default function OverviewGoals() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Saving 300000 In 30 Month</h1>
          <Badge className="bg-violet-500 hover:bg-violet-600">Active</Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing
      </p>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="font-medium">Thru, 28 March 2024</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Date</p>
          <p className="font-medium">Thru, 28 March 2024</p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">Progress</p>
          <div className="flex items-center">
            <span className="font-medium">60%</span>
            <span className="ml-1">
              <Loader />
            </span>
          </div>
        </div>
        <Progress value={60} className="h-4 bg-gray-100" />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Step</h2>

        {/* Completed Step */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="shadow-md border border-gray-200 h-6 w-6 rounded-sm flex items-center justify-center">
              <span className="text-xs">1</span>
            </div>
            <h3 className="font-medium">Meeting With Client</h3>
            <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-1">Desc</p>
            <p className="text-sm text-gray-700">
              Automate trades based on user-defined criteria using AI
              algorithms.
            </p>
          </div>
        </div>

        {/* Pending Step */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center">
              <span className="text-xs">2</span>
            </div>
            <h3 className="font-medium">Meeting With Client</h3>
            <Badge className="bg-gray-500 hover:bg-gray-600">None</Badge>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-1">Desc</p>
            <p className="text-sm text-gray-700">
              Automate trades based on user-defined criteria using AI
              algorithms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
