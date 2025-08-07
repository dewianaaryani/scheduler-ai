import { Badge } from "@/components/ui/badge";
import { NotebookPenIcon } from "lucide-react";

interface ScheduleItem {
  date: string;
  time: string;
  title: string;
  status: "Completed" | "None";
  description: string;
  notes?: string;
}

export default function ActivityGoals() {
  const scheduleItems: ScheduleItem[] = [
    {
      date: "15 April 2025",
      time: "11:00 - 12:00",
      title: "Meeting With Client",
      status: "Completed",
      description:
        "Automate trades based on user-defined criteria, using AI algorithms.",
      notes:
        "At first feel struggling to make a decision, but then you realize that you have to do it.",
    },
    {
      date: "16 April 2025",
      time: "11:00 - 12:00",
      title: "Meeting With Client",
      status: "Completed",
      description:
        "Automate trades based on user-defined criteria, using AI algorithms.",
      notes:
        "the second meeting was a success, we had a lot of fun and learned a lot",
    },
    {
      date: "18 April 2025",
      time: "11:00 - 12:00",
      title: "Meeting With Client",
      status: "None",
      description:
        "Automate trades based on user-defined criteria, using AI algorithms.",
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-semibold">Schedule Acitivies</h1>
      <p className="text-gray-500  mb-8">
        Schedule your activities and track your progress.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-6 bottom-0 w-[1px] bg-violet-200" />

        {/* Schedule items */}
        <div className="space-y-8">
          {scheduleItems.map((item, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-0  w-8 h-8 rounded-full border-4 border-violet-100 bg-violet-200 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
              </div>

              {/* Date and time */}
              <div className="text-sm text-gray-600 mb-2">
                {item.date} {item.time}
              </div>

              {/* Content card */}
              <div className="border rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3
                    className={`text-md font-medium ${
                      item.status === "Completed"
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <Badge
                    className={`${
                      item.status === "Completed"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Desc</p>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
                {item.notes && (
                  <div className="flex items-start gap-2 mt-2">
                    <NotebookPenIcon
                      className="size-9 md:size-4"
                      fill="orange"
                    />
                    <p className="text-sm text-gray-700">{item?.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
