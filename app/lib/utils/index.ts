export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
}
export function formatScheduleRange(startISO: Date, endISO: Date): string {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });

  const datePart = dateFormatter.format(start);
  const startTime = timeFormatter.format(start);
  const endTime = timeFormatter.format(end);

  return `${datePart} ${startTime}–${endTime} WIB`;
}
// Format date to readable string
export const formatDateYear = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

// Format time to readable string
export const formatDateYearTime = (date: Date) => {
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
};
export const formatTime = (date: Date) => {
  return new Date(date).toLocaleString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
};

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
export function StatusBorder(status: string) {
  switch (status) {
    case "COMPLETED":
      return "border-green-300 hover:border-green-400";
    case "ACTIVE":
      return "border-primary hover:border-primary-400";
    case "IN_PROGRESS":
      return "border-yellow-300 hover:border-yellow-400";
    case "MISSED":
      return "border-red-300 hover:border-red-400";
    case "ABANDONED":
      return "border-red-300 hover:border-red-400";
    default:
      return "border-gray-200 hover:border-gray-400";
  }
}

export function formatStatus(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Selesai";
    case "ACTIVE":
      return "Aktif";
    case "IN_PROGRESS":
      return "Sedang Berjalan";
    case "MISSED":
      return "Terlewat";
    case "ABANDONED":
      return "Dibatalkan";
    case "NONE":
      return "Belum Dimulai";
    default:
      return "Belum Dimulai";
  }
}
