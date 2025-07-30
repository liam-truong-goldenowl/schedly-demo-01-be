import { Get, Post, Body, Param, UseGuards, Controller } from '@nestjs/common';

import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('users/:userId/schedules')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@Param('userId') userId: number) {
    return this.scheduleService.findAllForUser({ userId });
  }

  @Post()
  create(@Param('userId') userId: number, @Body() body: CreateScheduleDto) {
    return this.scheduleService.createForUser({ userId, scheduleData: body });
  }
}
