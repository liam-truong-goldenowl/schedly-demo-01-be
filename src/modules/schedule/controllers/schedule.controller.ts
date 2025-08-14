import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Get,
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

import { CurrentUser } from '@/decorators/';
import { JwtAuthGuard } from '@/modules/auth/guards';

import { UserOwnsScheduleGuard } from '../guards';
import { ScheduleResDto, CreateScheduleDto, UpdateScheduleDto } from '../dto';
import {
  ListSchedulesUseCase,
  CreateScheduleUseCase,
  DeleteScheduleUseCase,
  UpdateScheduleUseCase,
} from '../use-cases';

@Controller('/schedules')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(
    private listSchedulesUseCase: ListSchedulesUseCase,
    private createScheduleUseCase: CreateScheduleUseCase,
    private updateScheduleUseCase: UpdateScheduleUseCase,
    private deleteScheduleUseCase: DeleteScheduleUseCase,
  ) {}

  @Get()
  @ApiResponse({ type: [ScheduleResDto] })
  findAll(@CurrentUser('id') userId: number) {
    return this.listSchedulesUseCase.execute({ userId });
  }

  @Post()
  @ApiBody({ type: CreateScheduleDto })
  @ApiResponse({ type: ScheduleResDto })
  create(
    @CurrentUser('id') userId: number,
    @Body() scheduleData: CreateScheduleDto,
  ): Promise<ScheduleResDto> {
    return this.createScheduleUseCase.execute({ userId, scheduleData });
  }

  @Patch(':id')
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({ type: ScheduleResDto })
  @UseGuards(UserOwnsScheduleGuard)
  update(
    @CurrentUser() userId: number,
    @Body() scheduleData: UpdateScheduleDto,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.updateScheduleUseCase.execute({
      userId,
      scheduleId,
      scheduleData,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserOwnsScheduleGuard)
  delete(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.deleteScheduleUseCase.execute({
      userId,
      scheduleId,
    });
  }
}
