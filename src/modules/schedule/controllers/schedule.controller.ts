import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
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

import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleService } from '../services/schedule.service';
import { ScheduleResponseDto } from '../dto/schedule-response.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';

@Controller('users/:userId/schedules')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiResponse({ type: [ScheduleResponseDto] })
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.scheduleService.findAllForUser({ userId });
  }

  @Post()
  @ApiBody({ type: CreateScheduleDto })
  @ApiResponse({ type: ScheduleResponseDto })
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.createForUser({ userId, scheduleData: body });
  }

  @Patch(':id')
  @UseGuards(UserOwnsScheduleGuard)
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({ type: ScheduleResponseDto })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserOwnsScheduleGuard)
  delete(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.scheduleService.deleteFromUser({ userId, scheduleId: id });
  }
}
