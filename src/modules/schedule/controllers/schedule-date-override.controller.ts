import { ApiBody, ApiResponse } from '@nestjs/swagger';
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

import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { ScheduleDateOverrideResDto } from '../dto/date-override-res.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { ScheduleDateOverrideService } from '../services/schedule-date-override.service';

@Controller('schedules/:scheduleId/date-overrides')
@UseGuards(JwtAuthGuard, UserOwnsScheduleGuard)
export class ScheduleDateOverrideController {
  constructor(
    private readonly dateOverrideService: ScheduleDateOverrideService,
  ) {}

  @Post()
  @ApiBody({ type: CreateDateOverrideDto })
  @ApiResponse({ type: [ScheduleDateOverrideResDto] })
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
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @ApiBody({ type: UpdateDateOverrideDto })
  @ApiResponse({ type: ScheduleDateOverrideResDto })
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
