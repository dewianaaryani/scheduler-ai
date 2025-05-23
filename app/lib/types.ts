export interface Goal {
  id: string;
  title: string;
  description: string;
  emoji: string; //
  startDate: Date;
  endDate: Date;
  percentComplete: number;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  schedules: Schedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  userId?: string;
  goalId?: string;
  order?: string;
  title: string;
  description: string;
  notes?: string;
  emoji: string;
  percentComplete?: string;
  startedTime: Date;
  endTime: Date;
  status: "NONE" | "IN_PROGRESS" | "COMPLETED" | "MISSED" | "ABANDONED";
  goal?: Goal;
}

export type Suggestion = {
  emoji: string;
  title: string;
};

export type AIResponse = {
  dataGoals?: Goal;
  message?: string;
  error?: string | null;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type GoalFormData = {
  initialValue: string;
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
};
