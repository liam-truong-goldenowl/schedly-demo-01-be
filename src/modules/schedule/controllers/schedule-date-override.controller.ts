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

import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { ScheduleDateOverrideService } from '../services/schedule-date-override.service';

@Controller('users/:userId/schedules/:scheduleId/date-overrides')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard, UserOwnsScheduleGuard)
export class ScheduleDateOverrideController {
  constructor(
    private readonly dateOverrideService: ScheduleDateOverrideService,
  ) {}

  @Post()
  create(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() body: CreateDateOverrideDto,
  ) {
    return this.dateOverrideService.create({
      scheduleId,
      dateOverrideData: body,
    });
  }

  @Delete(':id')
  delete(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dateOverrideService.delete({
      scheduleId,
      dateOverrideId: id,
    });
  }

  @Patch(':id')
  update(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDateOverrideDto,
  ) {
    return this.dateOverrideService.update({
      scheduleId,
      dateOverrideId: id,
      dateOverrideData: body,
    });
  }
}
