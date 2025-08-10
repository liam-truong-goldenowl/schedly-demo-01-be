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

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { CreateWeeklyHourDto } from '../dto/create-weekly-hour.dto';
import { UpdateWeeklyHourDto } from '../dto/update-weekly-hour.dto';
import { WeeklyHourResDto } from '../dto/schedule-weekly-hour-res.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { WeeklyHourService } from '../services/schedule-weekly-hour.service';

@Controller('schedules/:scheduleId/weekly-hours')
@UseGuards(JwtAuthGuard, UserOwnsScheduleGuard)
export class ScheduleWeeklyHourController {
  constructor(private readonly weeklyHourService: WeeklyHourService) {}

  @Post()
  @ApiBody({ type: CreateWeeklyHourDto })
  @ApiResponse({ type: WeeklyHourResDto })
  createWeeklyHour(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() createWeeklyHourDto: CreateWeeklyHourDto,
  ) {
    return this.weeklyHourService.create({
      scheduleId,
      weeklyHourData: createWeeklyHourDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.weeklyHourService.delete({
      scheduleId,
      weeklyHourId: id,
    });
  }

  @Patch(':id')
  @ApiBody({ type: UpdateWeeklyHourDto })
  @ApiResponse({ type: WeeklyHourResDto })
  update(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWeeklyHourDto: UpdateWeeklyHourDto,
  ) {
    return this.weeklyHourService.update({
      scheduleId,
      weeklyHourId: id,
      weeklyHourData: updateWeeklyHourDto,
    });
  }
}
