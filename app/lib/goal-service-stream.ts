import { AIResponse, GoalFormData } from "./types";

interface StreamMessage {
  type: 'status' | 'progress' | 'complete' | 'error';
  message?: string;
  progress?: number;
  data?: AIResponse;
  error?: string;
}

export async function processGoalDataStream(
  data: GoalFormData,
  onProgress?: (message: string, progress?: number) => void,
  onComplete?: (response: AIResponse) => void,
  onError?: (error: string) => void
): Promise<AIResponse | null> {
  try {
    const response = await fetch("/api/ai/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            break;
          }

          try {
            const message: StreamMessage = JSON.parse(data);
            
            switch (message.type) {
              case 'status':
                onProgress?.(message.message || '', message.progress);
                break;
              
              case 'progress':
                onProgress?.(message.message || '', message.progress);
                break;
              
              case 'complete':
                if (message.data) {
                  onComplete?.(message.data);
                  return message.data;
                }
                break;
              
              case 'error':
                onError?.(message.error || 'Unknown error');
                return null;
            }
          } catch (e) {
            console.error('Failed to parse SSE message:', e);
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Goal processing error:", error);
    onError?.(error instanceof Error ? error.message : "Failed to process goal");
    return null;
  }
}

// Wrapper for backward compatibility
export async function processGoalData(data: GoalFormData): Promise<AIResponse> {
  return new Promise((resolve, reject) => {
    processGoalDataStream(
      data,
      undefined,
      (response) => resolve(response),
      (error) => reject(new Error(error))
    ).catch(reject);
  });
}