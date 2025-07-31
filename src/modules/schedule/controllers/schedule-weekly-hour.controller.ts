import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
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
import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { CreateWeeklyHourDto } from '../dto/create-weekly-hour.dto';
import { UpdateWeeklyHourDto } from '../dto/update-weekly-hour.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { ScheduleWeeklyHourService } from '../services/schedule-weekly-hour.service';
import { ScheduleWeeklyHourResponseDto } from '../dto/schedule-weekly-hour-response.dto';

@Controller('users/:userId/schedules/:scheduleId/weekly-hours')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard, UserOwnsScheduleGuard)
@ApiParam({
  name: 'userId',
  description: 'ID of the user who owns the schedule',
  type: Number,
})
export class ScheduleWeeklyHourController {
  constructor(private readonly weeklyHourService: ScheduleWeeklyHourService) {}

  @Post()
  @ApiBody({ type: CreateWeeklyHourDto })
  @ApiResponse({ type: ScheduleWeeklyHourResponseDto })
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
  @ApiResponse({ type: ScheduleWeeklyHourResponseDto })
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
