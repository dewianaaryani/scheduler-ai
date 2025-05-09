export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}
export function formatScheduleRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const datePart = dateFormatter.format(start); // e.g. "Sat, May 17, 2025"
  const startTime = timeFormatter.format(start); // e.g. "5:00 PM"
  const endTime = timeFormatter.format(end); // e.g. "7:00 PM"

  return `${datePart} ${startTime}–${endTime}`;
}

export function StatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500 hover:bg-green-600";
    case "ACTIVE":
      return "bg-primary hover:bg-primary-600";
    case "IN_PROGRESS":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "MISSED":
      return "bg-red-500 hover:bg-red-600";
    case "ABANDONED":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

export function formatStatus(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "ACTIVE":
      return "Active";
    case "IN_PROGRESS":
      return "In Progress";
    case "MISSED":
      return "Missed";
    case "ABANDONED":
      return "Abandoned";
    default:
      return "None";
  }
}
