import { IsUUID } from 'class-validator';

export class CompleteWorkoutDto {
  @IsUUID()
  userId: string;
  @IsUUID()
  workoutId: string;
}
