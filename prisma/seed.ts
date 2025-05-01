import { PrismaClient, StatusSchedule, StatusGoal } from "@prisma/client";

const prisma = new PrismaClient();

// Function buat ambil notes random
function getRandomNote() {
  const notes = [
    "Jangan lupa siapkan alat-alat!",
    "Fokus tanpa distraksi!",
    "Sediakan air minum biar tetap segar.",
    "Kalau capek, break 5 menit dulu ya.",
    "Lakukan dengan penuh semangat!",
    "Pastikan semua peralatan dalam kondisi baik.",
    "Review hasil di akhir sesi.",
    "Nikmati prosesnya, bukan cuma hasilnya.",
    "Jaga mood positif sepanjang aktivitas.",
    "Set goal kecil untuk tiap sesi.",
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

// Function untuk memastikan panjang notes tidak lebih dari 500 karakter
function ensureMaxLength(notes: string, maxLength: number = 500): string {
  if (notes.length > maxLength) {
    return notes.substring(0, maxLength); // Potong notes jika lebih panjang dari maxLength
  }
  return notes;
}

async function main() {
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("⚠️ Tidak ada user ditemukan.");
    return;
  }

  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Daily Productive Routine",
      description:
        "Rangkaian kegiatan harian untuk meningkatkan produktivitas dan menjaga keseimbangan hidup.",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      status: StatusGoal.ACTIVE,
      emoji: "🏠", // Store as is
    },
  });

  const now = new Date();

  const schedulesData = [
    {
      userId: user.id,
      goalId: goal.id,
      order: "1",
      title: "Minum Wine Santai",
      description:
        "Meluangkan waktu untuk relaksasi setelah kerja keras seharian.",
      startedTime: now,
      endTime: new Date(now.getTime() + 60 * 60 * 1000),
      percentComplete: "0",
      emoji: "🍷", // Store as is
      status: StatusSchedule.NONE,
      notes: ensureMaxLength(getRandomNote()),
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "2",
      title: "Kerja Fokus di Laptop",
      description: "Dedikasikan waktu untuk menyelesaikan tugas-tugas penting.",
      startedTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(
        now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ),
      percentComplete: "0",
      emoji: "💻", // Store as is
      status: StatusSchedule.IN_PROGRESS,
      notes: ensureMaxLength(getRandomNote()),
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "3",
      title: "Nonton TV Series",
      description: "Me-time nonton serial favorit untuk recharge otak.",
      startedTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(
        now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ),
      percentComplete: "0",
      emoji: "📺", // Store as is
      status: StatusSchedule.NONE,
      notes: ensureMaxLength(getRandomNote()),
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "4",
      title: "Cek Jadwal",
      description: "Review agenda kerja dan rencana hari berikutnya.",
      startedTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
      ),
      percentComplete: "0",
      emoji: "⏰", // Store as is
      status: StatusSchedule.NONE,
      notes: ensureMaxLength(getRandomNote()),
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "5",
      title: "Morning Coffee & Planning",
      description: "Menikmati kopi pagi sambil menyiapkan to-do list.",
      startedTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      endTime: new Date(
        now.getTime() + 4 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000
      ),
      percentComplete: "0",
      emoji: "☕", // Store as is
      status: StatusSchedule.NONE,
      notes: ensureMaxLength(getRandomNote()),
    },
  ];

  // Use create instead of createMany to bypass any potential encoding issues
  for (const scheduleData of schedulesData) {
    await prisma.schedule.create({
      data: scheduleData,
    });
  }

  console.log(
    `✅ Seeder sukses! Goal & 5 Schedule berhasil ditambahkan beserta random notes.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
