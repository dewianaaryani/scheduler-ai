// pages/api/cron-schedule-notifications.js or app/api/cron-schedule-notifications/route.js

import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  // Verify cron authorization
  if (
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get current time and exactly 1 hour from now
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    console.log(
      `Checking schedules between ${now.toISOString()} and ${oneHourFromNow.toISOString()}`
    );

    // Query schedules starting in the next hour
    const upcomingSchedules = await prisma.schedule.findMany({
      where: {
        startedTime: {
          gte: now,
          lte: oneHourFromNow,
        },
        status: "NONE", // Adjust based on your status field
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        startedTime: "asc",
      },
    });

    console.log(`Found ${upcomingSchedules.length} upcoming schedules`);

    // Send notification for each schedule
    const emailResults = [];

    for (const schedule of upcomingSchedules) {
      try {
        const emailResult = await sendScheduleNotification(schedule);

        emailResults.push({
          scheduleId: schedule.id,
          email: schedule.user.email,
          sent: true,
          messageId: emailResult.data?.id,
          scheduledTime: schedule.startedTime,
        });
      } catch (emailError: unknown) {
        console.error(
          `Failed to send email for schedule ${schedule.id}:`,
          emailError
        );
        emailResults.push({
          scheduleId: schedule.id,
          email: schedule.user?.email,
          sent: false,
          error:
            typeof emailError === "object" &&
            emailError !== null &&
            "message" in emailError
              ? (emailError as { message: string }).message
              : String(emailError),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${upcomingSchedules.length} upcoming schedules`,
      timeRange: { from: now.toISOString(), to: oneHourFromNow.toISOString() },
      emailResults,
    });
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Type definition that matches what you actually need for notifications
type ScheduleWithUser = {
  id: string;
  title: string;
  description: string;
  startedTime: Date;
  user: {
    id: string;
    email: string;
    name: string | null;
    timezone?: string;
  };
};

// Send email notification using Resend
async function sendScheduleNotification(schedule: ScheduleWithUser) {
  // Calculate time until schedule starts
  const now = new Date();
  const scheduledTime = new Date(schedule.startedTime);

  // gunakan getTime() agar hasilnya number
  const minutesUntil = Math.round(
    (scheduledTime.getTime() - now.getTime()) / (1000 * 60)
  );

  // Format time based on user timezone or default
  const userTime = schedule.user?.timezone
    ? scheduledTime.toLocaleString("en-US", {
        timeZone: schedule.user.timezone,
        dateStyle: "full",
        timeStyle: "short",
      })
    : scheduledTime.toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      });

  const emailData = {
    from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
    to: [schedule.user.email],
    subject: `Reminder: Your appointment starts in ${minutesUntil} minutes`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment Reminder</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Appointment Reminder</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <p style="font-size: 18px; margin-bottom: 20px;">
              Hi ${schedule.user.name || "there"},
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #667eea; font-size: 22px;">
                ${schedule.title || "Scheduled Appointment"}
              </h2>
              
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0;"><strong>📅 Date & Time:</strong> ${userTime}</p>
                <p style="margin: 8px 0; color: #e74c3c; font-weight: bold;">⏱️ Starts in: ${minutesUntil} minutes</p>
                
                ${schedule.description ? `<p style="margin: 8px 0;"><strong>📝 Description:</strong> ${schedule.description}</p>` : ""}
              
              </div>
            </div>
            
           
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #1976d2;">
                💡 <strong>Tip:</strong> Make sure you're prepared and have everything you need for your appointment.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 25px 0;">
            
            <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 0;">
              This is an automated reminder from your scheduling system.<br>
              If you need to reschedule, please contact us as soon as possible.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Appointment Reminder

Hi ${schedule.user.name || "there"},

You have an upcoming appointment:

${schedule.title || "Scheduled Appointment"}
Date & Time: ${userTime}
Starts in: ${minutesUntil} minutes

${schedule.description ? `Description: ${schedule.description}` : ""}

Please make sure you're prepared for your appointment.

---
This is an automated reminder. If you need to reschedule, please contact us as soon as possible.
    `,
  };

  const result = await resend.emails.send(emailData);

  if (result.error) {
    throw new Error(`Resend API error: ${result.error.message}`);
  }

  console.log(`Email sent for schedule ${schedule.id}:`, result.data?.id);
  return result;
}
