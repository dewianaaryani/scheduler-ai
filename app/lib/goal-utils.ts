import { prisma } from "./db";

/**
 * Checks if all schedules for a goal are completed and automatically updates the goal status if needed
 * @param goalId - The ID of the goal to check
 * @returns Promise<boolean> - Returns true if goal was automatically completed, false otherwise
 */
export async function checkAndCompleteGoal(goalId: string): Promise<boolean> {
  try {
    // Get all schedules for this goal
    const goalSchedules = await prisma.schedule.findMany({
      where: { goalId },
      select: { status: true }
    });

    // If no schedules exist, don't complete the goal
    if (goalSchedules.length === 0) {
      return false;
    }

    // Check if all schedules are completed
    const allSchedulesCompleted = goalSchedules.every(schedule => 
      schedule.status === 'COMPLETED'
    );

    // If all schedules are completed, update the goal status to COMPLETED
    if (allSchedulesCompleted) {
      await prisma.goal.update({
        where: { id: goalId },
        data: { 
          status: 'COMPLETED',
          updatedAt: new Date()
        }
      });

      console.log(`Goal ${goalId} automatically completed - all ${goalSchedules.length} schedules finished`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error checking goal completion for goalId ${goalId}:`, error);
    return false;
  }
}