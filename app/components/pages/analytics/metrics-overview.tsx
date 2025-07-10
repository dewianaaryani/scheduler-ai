"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, CheckCircle, Clock, TrendingUp, Calendar, Zap } from "lucide-react"

interface MetricsOverviewProps {
  dateRange: string
}

export default function MetricsOverview({ dateRange }: MetricsOverviewProps) {
  // Mock data - in real app, this would be fetched based on dateRange
  const metrics = [
    {
      title: "Total Goals Created",
      value: "24",
      change: "+3",
      changeType: "positive" as const,
      icon: Target,
      description: "Goals created this period",
    },
    {
      title: "Goal Completion Rate",
      value: "78%",
      change: "+12%",
      changeType: "positive" as const,
      icon: CheckCircle,
      description: "Successfully completed goals",
    },
    {
      title: "Total Scheduled Hours",
      value: "156h",
      change: "+24h",
      changeType: "positive" as const,
      icon: Clock,
      description: "Time allocated to schedules",
    },
    {
      title: "Schedule Completion Rate",
      value: "85%",
      change: "+8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Schedules completed on time",
    },
    {
      title: "Active Goals",
      value: "7",
      change: "-2",
      changeType: "neutral" as const,
      icon: Calendar,
      description: "Currently active goals",
    },
    {
      title: "Productivity Score",
      value: "92",
      change: "+15",
      changeType: "positive" as const,
      icon: Zap,
      description: "This week's productivity rating",
    },
  ]

  const getChangeColor = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getChangeBackground = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "bg-green-50"
      case "negative":
        return "bg-red-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <div className="bg-violet-100 p-2 rounded-lg">
                <metric.icon className="h-4 w-4 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-800">{metric.value}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeBackground(metric.changeType)}`}>
                  <span className={getChangeColor(metric.changeType)}>{metric.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
