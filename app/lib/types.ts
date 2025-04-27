export interface Goal {
  id: string;
  title: string;
  description: string;
  emoji: string; //
  startDate: string;
  endDate: string;
  percentComplete: number;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  schedules: Schedule[];
}

export interface Schedule {
  id: string;
  userId: string;
  goalId: string;
  order: string;
  title: string;
  description: string;
  notes: string;
  emoji: string;
  percentComplete: string;
  startedTime: string;
  endTime: string;
  status: "NONE" | "IN_PROGRESS" | "COMPLETED" | "MISSED";
}
