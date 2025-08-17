import { ApiResponse } from '@nestjs/swagger';
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

import { JwtAccessAuthGuard } from '@/modules/auth/guards/jwt-access-auth.guard';

import { DateOverrideResDto } from '../dto/res/date-override-res.dto';
import { UserOwnsScheduleGuard } from '../guards/user-owns-schedule.guard';
import { CreateDateOverrideDto } from '../dto/req/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/req/update-date-override.dto';
import { CreateDateOverrideUseCase } from '../use-cases/create-date-override.use-case';
import { DeleteDateOverrideUseCase } from '../use-cases/delete-date-override.use-case';
import { UpdateDateOverrideUseCase } from '../use-cases/update-date-override.use-case';

@Controller('schedules/:scheduleId/date-overrides')
@UseGuards(JwtAccessAuthGuard, UserOwnsScheduleGuard)
export class DateOverrideController {
  constructor(
    private createOverrideUC: CreateDateOverrideUseCase,
    private updateOverrideUC: UpdateDateOverrideUseCase,
    private deleteOverrideUC: DeleteDateOverrideUseCase,
  ) {}

  @Post()
  @ApiResponse({ type: [DateOverrideResDto] })
  create(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() dateOverrideData: CreateDateOverrideDto,
  ) {
    return this.createOverrideUC.execute(scheduleId, dateOverrideData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) dateOverrideId: number,
  ) {
    return this.deleteOverrideUC.execute(scheduleId, dateOverrideId);
  }

  @Patch(':id')
  @ApiResponse({ type: DateOverrideResDto })
  update(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) dateOverrideId: number,
    @Body() dateOverrideData: UpdateDateOverrideDto,
  ) {
    return this.updateOverrideUC.execute(
      scheduleId,
      dateOverrideId,
      dateOverrideData,
    );
  }
}
