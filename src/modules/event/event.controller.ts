import { ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Body,
  Post,
  Param,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAccessAuthGuard } from '@/modules/auth/guards/jwt-access-auth.guard';

import { EventResDto } from './dto/res/event-res.dto';
import { CreateEventDto } from './dto/req/create-event.dto';
import { ListEventsResDto } from './dto/res/list-events-res.dto';
import { ListEventsQueryDto } from './dto/req/list-events-query.dto';
import { ListEventsUseCase } from './use-cases/list-events.use-case';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { ListEventSelectResDto } from './dto/res/list-event-select-res.dto';
import { ListEventSelectUseCase } from './use-cases/list-event-select.use-case';
import { ReadEventDetailsUseCase } from './use-cases/read-event-details.use-case';

@Controller('events')
export class EventController {
  constructor(
    private listEventsUC: ListEventsUseCase,
    private createEventUC: CreateEventUseCase,
    private readEventDetailsUC: ReadEventDetailsUseCase,
    private listEventSelectUC: ListEventSelectUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiResponse({ type: EventResDto })
  async create(
    @CurrentUser('id') userId: number,
    @Body() body: CreateEventDto,
  ): Promise<EventResDto> {
    return this.createEventUC.execute(userId, body);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiResponse({ type: ListEventsResDto })
  async findAll(
    @Query() query: ListEventsQueryDto,
    @CurrentUser('id') userId: number,
  ): Promise<ListEventsResDto> {
    return this.listEventsUC.execute(userId, query);
  }

  @Get('select')
  @ApiResponse({ type: [ListEventSelectResDto] })
  @UseGuards(JwtAccessAuthGuard)
  async findSelect(@CurrentUser('id') userId: number) {
    return this.listEventSelectUC.execute(userId);
  }

  @Get(':slug')
  @ApiResponse({ type: EventResDto })
  async findOne(@Param('slug') eventSlug: string) {
    return this.readEventDetailsUC.execute(eventSlug);
  }
}
