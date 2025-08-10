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

import { DateOverrideResDto } from '../dto/override-res.dto';
import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { DateOverrideService } from '../services/date-override.service';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';

@Controller('schedules/:scheduleId/date-overrides')
@UseGuards(JwtAuthGuard, UserOwnsScheduleGuard)
export class ScheduleDateOverrideController {
  constructor(private readonly dateOverrideService: DateOverrideService) {}

  @Post()
  @ApiBody({ type: CreateDateOverrideDto })
  @ApiResponse({ type: [DateOverrideResDto] })
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
  @ApiResponse({ type: DateOverrideResDto })
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
