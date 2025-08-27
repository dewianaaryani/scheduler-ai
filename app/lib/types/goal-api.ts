// Types for the 3-step goal creation flow

export interface ValidateGoalRequest {
  initialValue: string;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ValidateGoalResponse {
  status: 'valid' | 'incomplete' | 'invalid';
  title: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  emoji: string;
  message: string;
  validationErrors?: string[];
  suggestions?: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  };
}

export interface GenerateSchedulesRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  emoji?: string;
  preferences?: {
    workingHours?: { start: string; end: string };
    sessionDuration?: number;
    includeWeekends?: boolean;
  };
}

export interface ScheduleItem {
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  emoji?: string;
  progressPercent: number;
}

export interface GenerateSchedulesResponse {
  schedules: ScheduleItem[];
  totalDays: number;
  message?: string;
}

export interface SaveGoalRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  emoji: string;
  schedules: Array<{
    title: string;
    description: string;
    notes?: string;
    startedTime: string;
    endTime: string;
    emoji: string;
    percentComplete: string;
    order?: number;
  }>;
}

export interface SaveGoalResponse {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  emoji: string;
  status: string;
  schedules: Array<{
    id: string;
    title: string;
    description: string;
    startedTime: Date;
    endTime: Date;
    status: string;
  }>;
  duration: number;
  duplicate?: boolean;
}