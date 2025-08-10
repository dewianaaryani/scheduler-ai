// Test script for streaming API
async function testStream() {
  console.log('Testing streaming API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/ai/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth cookies if needed
      },
      body: JSON.stringify({
        initialValue: 'Saya ingin belajar bahasa Inggris'
      })
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

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
            console.log('Stream completed');
            break;
          }

          try {
            const message = JSON.parse(data);
            console.log('Received:', message);
            
            if (message.type === 'complete' && message.data) {
              console.log('\n=== Final Result ===');
              console.log('Title:', message.data.title);
              console.log('Description:', message.data.description);
              console.log('Start Date:', message.data.startDate);
              console.log('End Date:', message.data.endDate);
              console.log('Message:', message.data.message);
              console.log('Has dataGoals?', !!message.data.dataGoals);
              if (message.data.dataGoals) {
                console.log('Goal Title:', message.data.dataGoals.title);
                console.log('Goal Emoji:', message.data.dataGoals.emoji);
              }
            }
          } catch (e) {
            console.error('Failed to parse:', e.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run if this is the main module
if (require.main === module) {
  testStream();
}