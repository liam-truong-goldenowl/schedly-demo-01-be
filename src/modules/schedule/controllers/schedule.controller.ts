import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleService } from '../services/schedule.service';

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

  @Delete(':id')
  delete(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.scheduleService.deleteFromUser({ userId, scheduleId: id });
  }
}
