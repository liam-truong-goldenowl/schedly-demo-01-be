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
  delete() {}

  @Patch(':id')
  update() {}
}
