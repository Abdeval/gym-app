import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteWorkoutDto } from './programs.dto';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async getAllPrograms() {
    return await this.prisma.program.findMany({
      include: {
        workouts: {
          select: { title: true },
          orderBy: { day: 'asc' },
        },
      },
    });
  }

  async completeWorkout(dto: CompleteWorkoutDto) {
    // Check if workout was already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingProgress = await this.prisma.workoutProgress.findFirst({
      where: {
        userId: dto.userId,
        workoutId: dto.workoutId,
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingProgress) {
      return {
        message: 'Workout already completed today',
        progress: existingProgress,
      };
    }

    // Create new workout progress entry
    const progress = await this.prisma.workoutProgress.create({
      data: {
        userId: dto.userId,
        workoutId: dto.workoutId,
      },
      include: {
        workout: {
          include: {
            program: true,
          },
        },
      },
    });

    return { message: 'Workout completed successfully', progress };
  }

  async getStatistics(userId: string) {
    // 1. Workouts completed
    const workoutsCompleted = await this.prisma.workoutProgress.count({
      where: { userId },
    });

    // 2. Programs completed (assumes a program is completed if all its workouts are completed)
    const allPrograms = await this.prisma.program.findMany({
      include: {
        workouts: {
          select: { id: true },
        },
      },
    });

    const userCompletedWorkouts = await this.prisma.workoutProgress.findMany({
      where: { userId },
      select: { workoutId: true },
    });

    const completedWorkoutIds = new Set(
      userCompletedWorkouts.map((wp) => wp.workoutId),
    );

    let programsCompleted = 0;
    for (const program of allPrograms) {
      const allWorkoutIds = program.workouts.map((w) => w.id);
      const isCompleted = allWorkoutIds.every((id) =>
        completedWorkoutIds.has(id),
      );
      if (isCompleted) programsCompleted++;
    }

    // 3. Total time (sum of duration of exercises in completed workouts)
    const completedWorkouts = await this.prisma.workout.findMany({
      where: {
        id: { in: Array.from(completedWorkoutIds) },
      },
      include: {
        exercises: true,
      },
    });

    let totalMinutes = 0;
    for (const workout of completedWorkouts) {
      for (const ex of workout.exercises) {
        if (ex.duration) {
          totalMinutes += ex.duration / 60; // convert seconds to minutes
        } else {
          // estimate time for reps if duration is not specified
          totalMinutes += (ex.sets * ex.reps * 3) / 60; // 3 seconds per rep
        }
      }
      totalMinutes += workout.restTime / 60;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    const totalTimeStr = `${hours}h ${minutes}m`;

    // 4. Current streak (number of consecutive days with at least one workout)
    const progressDays = await this.prisma.workoutProgress.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true },
    });

    const dates = new Set(
      progressDays.map((p) => p.completedAt.toISOString().split('T')[0]),
    );
    let streak = 0;
    const current = new Date();

    while (dates.has(current.toISOString().split('T')[0])) {
      streak++;
      current.setDate(current.getDate() - 1);
    }

    return [
      {
        label: 'Workouts Completed',
        value: `${workoutsCompleted}`,
        icon: 'fitness',
      },
      {
        label: 'Current Streak',
        value: `${streak} day${streak > 1 ? 's' : ''}`,
        icon: 'flame',
      },
      { label: 'Total Time', value: totalTimeStr, icon: 'time' },
      {
        label: 'Programs Completed',
        value: `${programsCompleted}`,
        icon: 'trophy',
      },
    ];
  }

  async getWorkoutHistory(userId: string, limit = 10) {
    const history = await this.prisma.workoutProgress.findMany({
      where: { userId },
      include: {
        workout: {
          include: {
            program: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    return history;
  }
}
