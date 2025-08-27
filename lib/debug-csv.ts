import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateCSV } from './csv-utils';

const DEBUG_DIR = join(process.cwd(), 'debug-csv');

// Ensure debug directory exists
if (!existsSync(DEBUG_DIR)) {
  mkdirSync(DEBUG_DIR, { recursive: true });
}

interface GoalDebugData {
  title: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  emoji: string | null;
  status: string;
  message: string;
  error?: string | null;
  dataGoals?: unknown; // Allow any structure for debugging
  schedules?: Array<{
    title: string;
    description: string;
    startedTime: string;
    endTime: string;
    emoji: string;
  }>;
}

export function debugLogGoalCSV(data: GoalDebugData, prefix: string = 'goal') {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = join(DEBUG_DIR, `${prefix}_${timestamp}.csv`);
    
    // Log goal data
    const goalHeaders = ['Field', 'Value'];
    const goalRows = [
      ['Title', data.title || ''],
      ['Description', data.description || ''],
      ['Start Date', data.startDate || ''],
      ['End Date', data.endDate || ''],
      ['Emoji', data.emoji || ''],
      ['Status', data.status],
      ['Message', data.message],
      ['Error', data.error || ''],
      ['Timestamp', new Date().toISOString()],
    ];
    
    let csvContent = '=== GOAL DATA ===\n';
    csvContent += generateCSV(goalHeaders, goalRows);
    
    // Log schedules if present
    if (data.schedules && data.schedules.length > 0) {
      const scheduleHeaders = ['Title', 'Description', 'Start Time', 'End Time', 'Emoji'];
      const scheduleRows = data.schedules.map(s => [
        s.title,
        s.description,
        s.startedTime,
        s.endTime,
        s.emoji
      ]);
      
      csvContent += '\n\n=== SCHEDULES DATA ===\n';
      csvContent += generateCSV(scheduleHeaders, scheduleRows);
    }
    
    writeFileSync(filename, csvContent);
    console.log(`Debug CSV saved: ${filename}`);
  } catch (error) {
    console.error('Failed to save debug CSV:', error);
  }
}

export function debugLogStreamingData(
  prompt: string,
  response: string,
  parsed: unknown,
  error?: Error
) {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = join(DEBUG_DIR, `stream_debug_${timestamp}.csv`);
    
    const headers = ['Field', 'Value'];
    const rows: string[][] = [
      ['Timestamp', new Date().toISOString()],
      ['Prompt Length', prompt.length.toString()],
      ['Response Length', response.length.toString()],
      ['Has Error', error ? 'Yes' : 'No'],
      ['Error Message', error?.message || ''],
      ['Parsed Status', String((parsed as Record<string, unknown>)?.status || '')],
      ['Parsed Title', String((parsed as Record<string, unknown>)?.title || '')],
      ['Parsed Description', String((parsed as Record<string, unknown>)?.description || '')],
      ['Parsed Start Date', String((parsed as Record<string, unknown>)?.startDate || '')],
      ['Parsed End Date', String((parsed as Record<string, unknown>)?.endDate || '')],
    ];
    
    let csvContent = generateCSV(headers, rows);
    csvContent += '\n\n=== PROMPT ===\n' + prompt;
    csvContent += '\n\n=== RAW RESPONSE ===\n' + response;
    
    if (parsed) {
      csvContent += '\n\n=== PARSED DATA ===\n' + JSON.stringify(parsed, null, 2);
    }
    
    writeFileSync(filename, csvContent);
    console.log(`Stream debug CSV saved: ${filename}`);
  } catch (err) {
    console.error('Failed to save stream debug CSV:', err);
  }
}