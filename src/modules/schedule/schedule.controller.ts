import { Get, Param, UseGuards, Controller } from '@nestjs/common';

import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import type { User } from '../user/entities/user.entity';

import { ScheduleService } from './schedule.service';

@Controller('users/:userId/schedules')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@Param('userId') userId: User['id']) {
    return this.scheduleService.findAllForUser({ userId });
  }
}
