import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('users/:userId/schedules')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.scheduleService.findAllForUser({ userId });
  }

  @Post()
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateScheduleDto,
  ) {
    return this.scheduleService.createForUser({ userId, scheduleData: body });
  }

  @Patch(':id')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateForUser({
      userId,
      scheduleId: id,
      scheduleData: body,
    });
  }
}
