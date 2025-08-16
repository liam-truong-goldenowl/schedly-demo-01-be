import { ApiResponse } from '@nestjs/swagger';
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

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAccessAuthGuard } from '@/modules/auth/guards/jwt-access-auth.guard';

import { ScheduleResDto } from '../dto/res/schedule-res.dto';
import { CreateScheduleDto } from '../dto/req/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/req/update-schedule.dto';
import { ListSchedulesUseCase } from '../use-cases/list-schedules.use-case';
import { CreateScheduleUseCase } from '../use-cases/create-schedule.use-case';
import { DeleteScheduleUseCase } from '../use-cases/delete-schedule.use-case';
import { UpdateScheduleUseCase } from '../use-cases/update-schedule.use-case';

@Controller('/schedules')
@UseGuards(JwtAccessAuthGuard)
export class ScheduleController {
  constructor(
    private listSchedulesUC: ListSchedulesUseCase,
    private createScheduleUC: CreateScheduleUseCase,
    private updateScheduleUC: UpdateScheduleUseCase,
    private deleteScheduleUC: DeleteScheduleUseCase,
  ) {}

  @Get()
  @ApiResponse({ type: [ScheduleResDto] })
  findAll(@CurrentUser('id') userId: number) {
    return this.listSchedulesUC.execute({ userId });
  }

  @Post()
  create(
    @CurrentUser('id') userId: number,
    @Body() scheduleData: CreateScheduleDto,
  ): Promise<ScheduleResDto> {
    return this.createScheduleUC.execute(userId, scheduleData);
  }

  @Patch(':id')
  update(
    @CurrentUser() userId: number,
    @Body() scheduleData: UpdateScheduleDto,
    @Param('id', ParseIntPipe) scheduleId: number,
  ): Promise<ScheduleResDto> {
    return this.updateScheduleUC.execute(userId, scheduleId, scheduleData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.deleteScheduleUC.execute(userId, scheduleId);
  }
}
