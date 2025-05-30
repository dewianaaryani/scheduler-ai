/**
 * Utility functions for data validation and sanitization
 * to ensure data fits database constraints
 */

// Helper function to truncate strings to fit database constraints
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

// Helper function to validate and clean emoji (ensure it's safe for database)
export function validateEmoji(emoji: string): string {
  if (!emoji) return '📅'; // Default emoji
  
  // Trim and ensure it's not too long (database allows 20 chars)
  const cleanEmoji = emoji.trim();
  return cleanEmoji.length <= 20 ? cleanEmoji : '📅';
}

// Helper function to validate percentage complete
export function validatePercentComplete(percent: string | number): string {
  if (!percent) return '0';
  
  const percentStr = percent.toString();
  
  // Ensure it's a valid number between 0-100
  const num = parseInt(percentStr, 10);
  if (isNaN(num)) return '0';
  
  const validPercent = Math.max(0, Math.min(100, num));
  return validPercent.toString();
}

// Validation constraints matching database schema
export const VALIDATION_LIMITS = {
  GOAL_TITLE: 100,
  GOAL_DESCRIPTION: 500,
  SCHEDULE_TITLE: 100,
  SCHEDULE_DESCRIPTION: 500,
  SCHEDULE_NOTES: 500,
  SCHEDULE_ORDER: 100,
  EMOJI: 20,
  PERCENT_COMPLETE: 3,
} as const;

// Validate and clean goal data
export function validateGoalData(goalData: {
  title: string;
  description: string;
  emoji: string;
  startDate: string | Date;
  endDate: string | Date;
}) {
  return {
    title: truncateString(goalData.title, VALIDATION_LIMITS.GOAL_TITLE),
    description: truncateString(goalData.description, VALIDATION_LIMITS.GOAL_DESCRIPTION),
    emoji: validateEmoji(goalData.emoji),
    startDate: new Date(goalData.startDate),
    endDate: new Date(goalData.endDate),
  };
}

// Validate and clean schedule data
export function validateScheduleData(scheduleData: {
  title: string;
  description: string;
  notes?: string;
  startedTime: string | Date;
  endTime: string | Date;
  percentComplete?: string | number;
  emoji: string;
  order?: string;
}) {
  return {
    title: truncateString(scheduleData.title, VALIDATION_LIMITS.SCHEDULE_TITLE),
    description: truncateString(scheduleData.description, VALIDATION_LIMITS.SCHEDULE_DESCRIPTION),
    notes: scheduleData.notes ? truncateString(scheduleData.notes, VALIDATION_LIMITS.SCHEDULE_NOTES) : null,
    startedTime: new Date(scheduleData.startedTime),
    endTime: new Date(scheduleData.endTime),
    percentComplete: validatePercentComplete(scheduleData.percentComplete || '0'),
    emoji: validateEmoji(scheduleData.emoji),
    order: truncateString(scheduleData.order || '', VALIDATION_LIMITS.SCHEDULE_ORDER),
  };
}