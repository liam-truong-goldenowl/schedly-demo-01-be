import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
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
import { UserOwnsResourceGuard } from '@/common/guards/user-owns-resource.guard';

import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { ScheduleDateOverrideResponseDto } from '../dto/date-override-response.dto';
import { ScheduleDateOverrideService } from '../services/schedule-date-override.service';

@Controller('users/:userId/schedules/:scheduleId/date-overrides')
@UseGuards(JwtAuthGuard, UserOwnsResourceGuard, UserOwnsScheduleGuard)
@ApiParam({
  name: 'userId',
  description: 'ID of the user who owns the schedule',
  type: Number,
})
export class ScheduleDateOverrideController {
  constructor(
    private readonly dateOverrideService: ScheduleDateOverrideService,
  ) {}

  @Post()
  @ApiBody({ type: CreateDateOverrideDto })
  @ApiResponse({ type: ScheduleDateOverrideResponseDto })
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
  @ApiResponse({ type: ScheduleDateOverrideResponseDto })
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
