"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react"

interface AnalyticsPageHeaderProps {
  dateRange: string
  onDateRangeChange: (range: string) => void
}

export default function AnalyticsPageHeader({ dateRange, onDateRangeChange }: AnalyticsPageHeaderProps) {
  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting analytics report...")
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>
              <p className="text-gray-600">
                Discover your productivity patterns and track your progress toward achieving your goals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-40 bg-white border-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleExport}
            variant="outline"
            className="border-violet-300 text-violet-700 hover:bg-violet-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Insights Banner */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Your productivity is trending upward! 📈</h3>
              <p className="text-gray-600 text-sm">
                You've completed 23% more schedules this month compared to last month. Keep up the great work!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
