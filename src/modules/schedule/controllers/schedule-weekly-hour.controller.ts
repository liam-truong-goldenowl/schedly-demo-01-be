import {
  Body,
  Post,
  Param,
  Patch,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { CreateWeeklyHourDto } from '../dto/create-weekly-hour.dto';
import { UpdateWeeklyHourDto } from '../dto/update-weekly-hour.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { ScheduleWeeklyHourService } from '../services/schedule-weekly-hour.service';

@Controller('users/:userId/schedules/:scheduleId/weekly-hours')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard, UserOwnsScheduleGuard)
export class ScheduleWeeklyHourController {
  constructor(private readonly weeklyHourService: ScheduleWeeklyHourService) {}

  @Post()
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
