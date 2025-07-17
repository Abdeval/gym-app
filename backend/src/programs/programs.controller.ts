import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CompleteWorkoutDto } from './programs.dto';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  getAllPrograms() {
    return this.programsService.getAllPrograms();
  }

  @Post('complete')
  async completeWorkout(@Body() dto: CompleteWorkoutDto) {
    return this.programsService.completeWorkout(dto);
  }

  @Get('history/:userId')
  async getWorkoutHistory(@Param('userId') userId: string) {
    return this.programsService.getWorkoutHistory(userId);
  }

  @Get('statistics/:userId')
  getStatistics(@Param('userId') userId: string) {
    return this.programsService.getStatistics(userId);
  }
}
