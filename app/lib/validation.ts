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
  if (!percent) return '10'; // Default to 10% instead of 0
  
  const percentStr = percent.toString();
  
  // Ensure it's a valid number between 10-100 (never 0)
  const num = parseInt(percentStr, 10);
  if (isNaN(num)) return '10';
  
  const validPercent = Math.max(10, Math.min(100, num)); // Minimum 10%
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
  // Validate dates - if invalid, use current date as fallback
  let startedTime: Date;
  let endTime: Date;
  
  try {
    startedTime = new Date(scheduleData.startedTime);
    if (isNaN(startedTime.getTime())) {
      console.error('Invalid startedTime:', scheduleData.startedTime);
      throw new Error('Invalid startedTime');
    }
  } catch (e) {
    // Fallback to current date at 9 AM
    startedTime = new Date();
    startedTime.setHours(9, 0, 0, 0);
  }
  
  try {
    endTime = new Date(scheduleData.endTime);
    if (isNaN(endTime.getTime())) {
      console.error('Invalid endTime:', scheduleData.endTime);
      throw new Error('Invalid endTime');
    }
  } catch (e) {
    // Fallback to 3 hours after startedTime
    endTime = new Date(startedTime);
    endTime.setHours(startedTime.getHours() + 3);
  }
  
  return {
    title: truncateString(scheduleData.title, VALIDATION_LIMITS.SCHEDULE_TITLE),
    description: truncateString(scheduleData.description, VALIDATION_LIMITS.SCHEDULE_DESCRIPTION),
    notes: scheduleData.notes ? truncateString(scheduleData.notes, VALIDATION_LIMITS.SCHEDULE_NOTES) : null,
    startedTime,
    endTime,
    percentComplete: validatePercentComplete(scheduleData.percentComplete || '10'),
    emoji: validateEmoji(scheduleData.emoji),
    order: truncateString(scheduleData.order || '', VALIDATION_LIMITS.SCHEDULE_ORDER),
  };
}