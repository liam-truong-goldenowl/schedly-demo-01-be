import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Body,
  Post,
  Param,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { LimitPipe } from '@/pipes';
import { CurrentUser } from '@/decorators';
import { JwtAuthGuard } from '@/modules/auth/guards';

import { DEFAULT_EVENT_LIMIT } from './event.config';
import { EventResDto, CreateEventDto, ListEventResDto } from './dto';
import { UserOwnsEventGuard, UserOwnsScheduleGuard } from './guards';
import {
  ListEventsUseCase,
  CreateEventUseCase,
  DeleteEventUseCase,
  ReadEventDetailsUseCase,
} from './use-cases';

@Controller('events')
export class EventController {
  constructor(
    private listEventsUC: ListEventsUseCase,
    private createEventUC: CreateEventUseCase,
    private deleteEventUC: DeleteEventUseCase,
    private readEventDetailsUC: ReadEventDetailsUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ type: EventResDto })
  @UseGuards(JwtAuthGuard, UserOwnsScheduleGuard)
  async create(
    @CurrentUser('id') userId: number,
    @Body() body: CreateEventDto,
  ) {
    return this.createEventUC.execute({
      ...body,
      userId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ListEventResDto })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: DEFAULT_EVENT_LIMIT,
  })
  async findAll(
    @CurrentUser('id') userId: number,
    @Query('cursor') cursor: string | undefined,
    @Query('limit', new LimitPipe(DEFAULT_EVENT_LIMIT)) limit: number,
  ) {
    return this.listEventsUC.execute({ userId, limit, cursor });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserOwnsEventGuard)
  async delete(@Param('id', ParseIntPipe) eventId: number) {
    return this.deleteEventUC.execute(eventId);
  }

  @Get(':slug')
  async findOne(@Param('slug') eventSlug: string) {
    return this.readEventDetailsUC.execute(eventSlug);
  }
}
