import { PrismaClient, StatusSchedule } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("⚠️ Tidak ada user ditemukan.");
    return;
  }

  // Create Goal pertama
  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Daily Productive Routine",
      description:
        "Rangkaian kegiatan harian untuk meningkatkan produktivitas dan menjaga keseimbangan hidup.",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 minggu ke depan
      status: "ACTIVE",
      icon: "Home", // Lucide Icon string
    },
  });

  const currentDate = new Date(); // Mulai dari hari ini

  // Buat 5 Schedule dengan tanggal yang berbeda-beda tiap hari
  const schedulesData = [
    {
      userId: user.id,
      goalId: goal.id,
      order: "1",
      title: "Minum Wine Santai",
      description:
        "Meluangkan waktu untuk relaksasi setelah kerja keras seharian.",
      startedTime: currentDate,
      endTime: new Date(currentDate.setHours(currentDate.getHours() + 1)),
      icon: "Wine",
      status: StatusSchedule.NONE, // Ganti string dengan enum
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "2",
      title: "Kerja Fokus di Laptop",
      description: "Dedikasikan waktu untuk menyelesaikan tugas-tugas penting.",
      startedTime: new Date(currentDate.setDate(currentDate.getDate() + 1)), // +1 hari
      endTime: new Date(currentDate.setHours(currentDate.getHours() + 2)),
      icon: "Laptop",
      status: StatusSchedule.IN_PROGRESS, // Ganti string dengan enum
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "3",
      title: "Nonton TV Series",
      description: "Me-time nonton serial favorit untuk recharge otak.",
      startedTime: new Date(currentDate.setDate(currentDate.getDate() + 1)), // +1 hari lagi
      endTime: new Date(currentDate.setHours(currentDate.getHours() + 3)),
      icon: "Tv",
      status: StatusSchedule.NONE, // Ganti string dengan enum
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "4",
      title: "Cek Jadwal",
      description: "Review agenda kerja dan rencana hari berikutnya.",
      startedTime: new Date(currentDate.setDate(currentDate.getDate() + 1)), // +1 hari lagi
      endTime: new Date(currentDate.setHours(currentDate.getHours() + 4)),
      icon: "Clock",
      status: StatusSchedule.NONE, // Ganti string dengan enum
    },
    {
      userId: user.id,
      goalId: goal.id,
      order: "5",
      title: "Morning Coffee & Planning",
      description: "Menikmati kopi pagi sambil menyiapkan to-do list.",
      startedTime: new Date(currentDate.setDate(currentDate.getDate() + 1)), // +1 hari lagi
      endTime: new Date(currentDate.setHours(currentDate.getHours() + 5)),
      icon: "Coffee",
      status: StatusSchedule.NONE, // Ganti string dengan enum
    },
  ];

  await prisma.schedule.createMany({ data: schedulesData });

  console.log(
    `✅ Seeder sukses! Goal & 5 Schedule berhasil ditambahkan dengan tanggal berbeda setiap hari.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
