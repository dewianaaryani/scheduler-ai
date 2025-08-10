// Test AI date validation
const testCases = [
  {
    name: "Valid: Tomorrow to next week",
    data: {
      initialValue: "Belajar JavaScript",
      title: "Belajar JavaScript",
      description: "Mempelajari JavaScript dasar",
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
    },
    expected: "success"
  },
  {
    name: "Invalid: Today as start date",
    data: {
      initialValue: "Belajar JavaScript",
      title: "Belajar JavaScript",
      description: "Mempelajari JavaScript dasar",
      startDate: new Date().toISOString(), // Today
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
    },
    expected: "error: Tanggal mulai harus minimal besok"
  },
  {
    name: "Invalid: Past date as start",
    data: {
      initialValue: "Belajar JavaScript",
      title: "Belajar JavaScript", 
      description: "Mempelajari JavaScript dasar",
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
    },
    expected: "error: Tanggal mulai harus minimal besok"
  },
  {
    name: "Invalid: End date is 5 months from start date",
    data: {
      initialValue: "Belajar JavaScript",
      title: "Belajar JavaScript",
      description: "Mempelajari JavaScript dasar",
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endDate: (() => {
        const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
        start.setMonth(start.getMonth() + 5); // 5 months from start
        return start.toISOString();
      })()
    },
    expected: "error: Tanggal selesai tidak boleh lebih dari 4 bulan dari tanggal mulai"
  },
  {
    name: "Valid: Exactly 4 months from start date",
    data: {
      initialValue: "Belajar JavaScript",
      title: "Belajar JavaScript",
      description: "Mempelajari JavaScript dasar",
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endDate: (() => {
        const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
        start.setMonth(start.getMonth() + 4); // Exactly 4 months from start
        return start.toISOString();
      })()
    },
    expected: "success"
  },
  {
    name: "Invalid: End date before start date",
    data: {
      initialValue: "Belajar JavaScript",
      title: "Belajar JavaScript",
      description: "Mempelajari JavaScript dasar",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
    },
    expected: "error: Tanggal selesai harus setelah tanggal mulai"
  }
];

async function testValidation() {
  console.log("Testing AI date validation...\n");
  
  for (const test of testCases) {
    try {
      const response = await fetch("http://localhost:3000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You'll need to add authentication headers here
        },
        body: JSON.stringify(test.data)
      });
      
      const result = await response.json();
      const status = response.ok ? "success" : `error: ${result.error}`;
      const passed = status.includes(test.expected.split(":")[0]) ? "✅" : "❌";
      
      console.log(`${passed} ${test.name}`);
      console.log(`   Expected: ${test.expected}`);
      console.log(`   Got: ${status}`);
      console.log("");
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      console.log("");
    }
  }
}

// Note: To run this test, you need to:
// 1. Start the dev server: npm run dev
// 2. Add authentication headers (get from browser DevTools)
// 3. Run: node test-ai-validation.js

console.log("Test cases prepared. To run tests:");
console.log("1. Start dev server: npm run dev");
console.log("2. Add authentication headers to the test script");
console.log("3. Run: node test-ai-validation.js");
console.log("\nTest cases:");
testCases.forEach(t => console.log(`- ${t.name}: expects ${t.expected}`));