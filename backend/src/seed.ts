import { PrismaClient } from '../shared/prisma'; // Adjust path if needed
const prisma = new PrismaClient();

const PROGRAMS = {
  beginner: [
    {
      id: '1',
      name: 'Full Body Starter',
      duration: '4 weeks',
      level: 'Beginner',
      description: 'Perfect introduction to weight training',
      workouts: ['Upper Body', 'Lower Body', 'Full Body'],
    },
    {
      id: '2',
      name: 'Bodyweight Basics',
      duration: '6 weeks',
      level: 'Beginner',
      description: 'Build strength using your own body weight',
      workouts: ['Push Movements', 'Pull Movements', 'Legs & Core'],
    },
  ],
  intermediate: [
    {
      id: '3',
      name: 'Push Pull Legs',
      duration: '8 weeks',
      level: 'Intermediate',
      description: 'Classic muscle building split',
      workouts: ['Push Day', 'Pull Day', 'Leg Day'],
    },
    {
      id: '4',
      name: 'Upper Lower Split',
      duration: '6 weeks',
      level: 'Intermediate',
      description: 'Balanced approach to muscle development',
      workouts: ['Upper Body', 'Lower Body'],
    },
  ],
  advanced: [
    {
      id: '5',
      name: 'Powerlifting Focus',
      duration: '12 weeks',
      level: 'Advanced',
      description: 'Build maximum strength in the big 3',
      workouts: ['Squat Focus', 'Bench Focus', 'Deadlift Focus'],
    },
    {
      id: '6',
      name: 'Hypertrophy Specialization',
      duration: '10 weeks',
      level: 'Advanced',
      description: 'Maximum muscle growth protocol',
      workouts: ['Chest & Triceps', 'Back & Biceps', 'Shoulders', 'Legs'],
    },
  ],
};

async function main() {
  // Find existing user
  const user = await prisma.user.findUnique({
    where: { email: 'abdou@gmail.com' },
  });

  if (!user) {
    throw new Error('❌ User with email "abdou@gmail.com" not found.');
  }

  console.log(`✅ Found user ${user.email} (id: ${user.id})`);

  let workoutCounter = 1;

  for (const difficulty in PROGRAMS) {
    const programs = PROGRAMS[difficulty as keyof typeof PROGRAMS];

    for (const program of programs) {
      const createdProgram = await prisma.program.create({
        data: {
          id: program.id,
          title: program.name,
          description: program.description,
          level: program.level,
          workouts: {
            create: program.workouts.map((workoutTitle, index) => ({
              id: `w${workoutCounter++}`,
              day: index + 1,
              title: workoutTitle,
              restTime: 60,
              exercises: {
                create: [
                  {
                    title: `${workoutTitle} Exercise 1`,
                    sets: 3,
                    reps: 12,
                    duration: 60,
                  },
                  {
                    title: `${workoutTitle} Exercise 2`,
                    sets: 4,
                    reps: 10,
                    duration: 90,
                  },
                ],
              },
            })),
          },
        },
      });

      const workouts = await prisma.workout.findMany({
        where: { programId: createdProgram.id },
        select: { id: true },
        orderBy: { day: 'asc' },
      });

      if (workouts.length > 0) {
        await prisma.workoutProgress.create({
          data: {
            userId: user.id,
            workoutId: workouts[0].id,
            completedAt: new Date(),
          },
        });

        console.log(
          `✅ Added progress for workout '${workouts[0].id}' in program '${createdProgram.title}'`,
        );
      }
    }
  }

  console.log('🎉 Finished seeding programs and progress.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(() => prisma.$disconnect());
