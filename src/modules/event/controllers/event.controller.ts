import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Body,
  Post,
  Query,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { LimitPipe } from '@/common/pipes/limit.pipe';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { DEFAULT_EVENT_LIMIT } from '../config';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../services/event.service';
import { ListEventResDto } from '../dto/list-event-res.dto';
import { CreateEventResDto } from '../dto/create-event-res.dto';
import { UserOwnsEventGuard } from '../guards/user-owns-event.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ type: CreateEventResDto })
  async create(
    @CurrentUser('id') userId: number,
    @Body() body: CreateEventDto,
  ) {
    return this.eventService.createEvent({
      userId,
      body,
    });
  }

  @Get()
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
    return this.eventService.findAllEvents({ userId, limit, cursor });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserOwnsEventGuard)
  async delete(@Param('id', ParseIntPipe) eventId: number) {
    return this.eventService.deleteEvent({ eventId });
  }
}
