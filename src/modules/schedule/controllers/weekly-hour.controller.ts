import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards';

import { UserOwnsScheduleGuard, ScheduleOwnsWeeklyHourGuard } from '../guards';
import {
  WeeklyHourResDto,
  CreateWeeklyHourDto,
  UpdateWeeklyHourDto,
} from '../dto';
import {
  CreateWeeklyHourUseCase,
  DeleteWeeklyHourUseCase,
  UpdateWeeklyHourUseCase,
} from '../use-cases';

@Controller('schedules/:scheduleId/weekly-hours')
@UseGuards(JwtAuthGuard, UserOwnsScheduleGuard)
export class WeeklyHourController {
  constructor(
    private createWeeklyHourUseCase: CreateWeeklyHourUseCase,
    private updateWeeklyHourUseCase: UpdateWeeklyHourUseCase,
    private deleteWeeklyHourUseCase: DeleteWeeklyHourUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateWeeklyHourDto })
  @ApiResponse({ type: WeeklyHourResDto })
  createWeeklyHour(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() weeklyHourData: CreateWeeklyHourDto,
  ) {
    return this.createWeeklyHourUseCase.execute({
      scheduleId,
      weeklyHourData,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ScheduleOwnsWeeklyHourGuard)
  delete(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) weeklyHourId: number,
  ) {
    return this.deleteWeeklyHourUseCase.execute({
      scheduleId,
      weeklyHourId,
    });
  }

  @Patch(':id')
  @ApiBody({ type: UpdateWeeklyHourDto })
  @ApiResponse({ type: WeeklyHourResDto })
  @UseGuards(ScheduleOwnsWeeklyHourGuard)
  update(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) weeklyHourId: number,
    @Body() weeklyHourData: UpdateWeeklyHourDto,
  ) {
    return this.updateWeeklyHourUseCase.execute({
      scheduleId,
      weeklyHourId,
      weeklyHourData,
    });
  }
}
