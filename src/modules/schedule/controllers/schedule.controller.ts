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
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { ScheduleResDto } from '../dto/schedule-res.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleService } from '../services/schedule.service';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';

@Controller('/schedules')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiResponse({ type: [ScheduleResDto] })
  findAll(@CurrentUser() userId: number) {
    return this.scheduleService.findAllForUser({ userId });
  }

  @Post()
  @ApiBody({ type: CreateScheduleDto })
  @ApiResponse({ type: ScheduleResDto })
  create(
    @CurrentUser() userId: number,
    @Body() body: CreateScheduleDto,
  ): Promise<ScheduleResDto> {
    return this.scheduleService.createForUser({ userId, scheduleData: body });
  }

  @Patch(':id')
  @UseGuards(UserOwnsScheduleGuard)
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({ type: ScheduleResDto })
  update(
    @CurrentUser() userId: number,
    @Body() body: UpdateScheduleDto,
    @Param('id', ParseIntPipe) id: number,
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
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.scheduleService.deleteFromUser({ userId, scheduleId: id });
  }
}
