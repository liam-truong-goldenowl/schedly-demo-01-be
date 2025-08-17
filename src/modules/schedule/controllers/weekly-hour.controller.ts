import { ApiResponse } from '@nestjs/swagger';
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

import { JwtAccessAuthGuard } from '@/modules/auth/guards/jwt-access-auth.guard';

import { WeeklyHourResDto } from '../dto/res/weekly-hour-res.dto';
import { CreateWeeklyHourDto } from '../dto/req/create-weekly-hour.dto';
import { UpdateWeeklyHourDto } from '../dto/req/update-weekly-hour.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { CreateWeeklyHourUseCase } from '../use-cases/create-weekly-hour.use-case';
import { DeleteWeeklyHourUseCase } from '../use-cases/delete-weekly-hour.use-case';
import { UpdateWeeklyHourUseCase } from '../use-cases/update-weekly-hour.use-case';

@Controller('schedules/:scheduleId/weekly-hours')
@UseGuards(JwtAccessAuthGuard, UserOwnsScheduleGuard)
export class WeeklyHourController {
  constructor(
    private createWeeklyHourUC: CreateWeeklyHourUseCase,
    private updateWeeklyHourUC: UpdateWeeklyHourUseCase,
    private deleteWeeklyHourUC: DeleteWeeklyHourUseCase,
  ) {}

  @Post()
  @ApiResponse({ type: WeeklyHourResDto })
  createWeeklyHour(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() weeklyHourData: CreateWeeklyHourDto,
  ) {
    return this.createWeeklyHourUC.execute(scheduleId, weeklyHourData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) weeklyHourId: number,
  ) {
    return this.deleteWeeklyHourUC.execute(scheduleId, weeklyHourId);
  }

  @Patch(':id')
  @ApiResponse({ type: WeeklyHourResDto })
  update(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) weeklyHourId: number,
    @Body() weeklyHourData: UpdateWeeklyHourDto,
  ) {
    return this.updateWeeklyHourUC.execute(
      scheduleId,
      weeklyHourId,
      weeklyHourData,
    );
  }
}
