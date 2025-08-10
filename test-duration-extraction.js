// Test duration extraction from title
console.log("Testing duration extraction from title:\n");

const testCases = [
  {
    title: "Program Pembersihan dan Penataan Rumah 3 Minggu",
    description: "Program komprehensif selama 3 minggu untuk membersihkan...",
    expectedDuration: "3 weeks",
    expectedDays: 21
  },
  {
    title: "Belajar JavaScript 2 Bulan",
    description: "Kursus JavaScript intensif",
    expectedDuration: "2 months",
    expectedDays: 60
  },
  {
    title: "Program Diet 30 Hari",
    description: "Program diet sehat",
    expectedDuration: "30 days",
    expectedDays: 30
  },
  {
    title: "Latihan Marathon 4 Minggu",
    description: "Persiapan marathon",
    expectedDuration: "4 weeks",
    expectedDays: 28
  }
];

// Regex patterns to extract duration
const patterns = [
  { regex: /(\d+)\s*minggu/i, unit: 'week', multiplier: 7 },
  { regex: /(\d+)\s*bulan/i, unit: 'month', multiplier: 30 },
  { regex: /(\d+)\s*hari/i, unit: 'day', multiplier: 1 }
];

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}: "${test.title}"`);
  
  let found = false;
  for (const pattern of patterns) {
    const match = test.title.match(pattern.regex) || test.description.match(pattern.regex);
    if (match) {
      const number = parseInt(match[1]);
      const days = number * pattern.multiplier - (pattern.unit === 'week' ? number - 1 : 0);
      
      console.log(`  Found: ${number} ${pattern.unit}(s)`);
      console.log(`  Calculated days: ${days}`);
      console.log(`  Expected days: ${test.expectedDays}`);
      console.log(`  Result: ${days === test.expectedDays ? '✅ Correct' : '❌ Wrong'}`);
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log("  ❌ No duration found");
  }
  console.log();
});

console.log("\n=== Calculation Formula ===");
console.log("For weeks: (weeks * 7) - (weeks - 1)");
console.log("  1 week = 7 days");
console.log("  2 weeks = 14 days");
console.log("  3 weeks = 21 days");
console.log("  4 weeks = 28 days");
console.log("\nFor months: months * 30");
console.log("For days: days * 1");