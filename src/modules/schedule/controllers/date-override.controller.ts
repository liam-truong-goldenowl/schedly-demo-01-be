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

import { JwtAuthGuard } from '@/modules/auth/guards';

import { UserOwnsScheduleGuard } from '../guards';
import {
  DateOverrideResDto,
  CreateDateOverrideDto,
  UpdateDateOverrideDto,
} from '../dto';
import {
  CreateDateOverrideUseCase,
  DeleteDateOverrideUseCase,
  UpdateDateOverrideUseCase,
} from '../use-cases';

@Controller('schedules/:scheduleId/date-overrides')
@UseGuards(JwtAuthGuard, UserOwnsScheduleGuard)
export class DateOverrideController {
  constructor(
    private createOverrideUseCase: CreateDateOverrideUseCase,
    private updateOverrideUseCase: UpdateDateOverrideUseCase,
    private deleteOverrideUseCase: DeleteDateOverrideUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateDateOverrideDto })
  @ApiResponse({ type: [DateOverrideResDto] })
  create(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() dateOverrideData: CreateDateOverrideDto,
  ) {
    return this.createOverrideUseCase.execute({
      scheduleId,
      dateOverrideData,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) dateOverrideId: number,
  ) {
    return this.deleteOverrideUseCase.execute({
      scheduleId,
      dateOverrideId,
    });
  }

  @Patch(':id')
  @ApiBody({ type: UpdateDateOverrideDto })
  @ApiResponse({ type: DateOverrideResDto })
  update(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Param('id', ParseIntPipe) dateOverrideId: number,
    @Body() dateOverrideData: UpdateDateOverrideDto,
  ) {
    return this.updateOverrideUseCase.execute({
      scheduleId,
      dateOverrideId,
      dateOverrideData,
    });
  }
}
