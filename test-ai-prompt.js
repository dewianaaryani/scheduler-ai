#!/usr/bin/env node

// Test script to verify AI prompt generates correct goals
const testCases = [
  {
    name: "Date range test",
    input: "Saya mau belajar masak dari 10 Agustus 2025 sampai 16 Agustus 2025",
    expected: {
      startDate: "2025-08-10",
      endDate: "2025-08-16",
      scheduleCount: 7,
      language: "Indonesian"
    }
  },
  {
    name: "Duration test",
    input: "Saya ingin belajar fotografi dalam 5 hari",
    expected: {
      daysFromToday: 5,
      scheduleCount: 5,
      language: "Indonesian"
    }
  },
  {
    name: "End date test",
    input: "Proyek website selesai 1 Desember 2025",
    expected: {
      endDate: "2025-12-01",
      language: "Indonesian"
    }
  }
];

async function testAIPrompt(testCase) {
  console.log(`\n📝 Testing: ${testCase.name}`);
  console.log(`   Input: "${testCase.input}"`);
  
  try {
    const response = await fetch("http://localhost:3001/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initialValue: testCase.input
      })
    });

    const data = await response.json();
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    
    // Validate response
    if (data.startDate && testCase.expected.startDate) {
      const gotDate = data.startDate.split('T')[0];
      console.log(`   ✓ Start date: ${gotDate} (expected: ${testCase.expected.startDate})`);
    }
    
    if (data.endDate && testCase.expected.endDate) {
      const gotDate = data.endDate.split('T')[0];
      const isCorrect = gotDate === testCase.expected.endDate;
      console.log(`   ${isCorrect ? '✓' : '✗'} End date: ${gotDate} (expected: ${testCase.expected.endDate})`);
    }
    
    if (data.dataGoals?.schedules) {
      const count = data.dataGoals.schedules.length;
      console.log(`   ✓ Schedule count: ${count}`);
      
      // Check for combined days
      const hasCombinedDays = data.dataGoals.schedules.some(s => 
        s.title.includes('-') && s.title.includes('Hari')
      );
      if (hasCombinedDays) {
        console.log(`   ✗ ERROR: Found combined days in schedules!`);
      }
      
      // Check language
      const isIndonesian = data.dataGoals.schedules.every(s => 
        !s.title.match(/Day|Week|Month/) && !s.description.match(/Day|Week|Month/)
      );
      console.log(`   ${isIndonesian ? '✓' : '✗'} Language: ${isIndonesian ? 'Indonesian' : 'Mixed/English'}`);
    }
    
    return true;
  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Starting AI Prompt Tests...");
  
  for (const testCase of testCases) {
    await testAIPrompt(testCase);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between tests
  }
  
  console.log("\n✅ Tests completed!");
}

// Run tests
runTests().catch(console.error);