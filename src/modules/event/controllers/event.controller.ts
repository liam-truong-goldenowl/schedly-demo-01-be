import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Body,
  Post,
  Query,
  UseGuards,
  Controller,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../services/event.service';
import { CreateEventResDto } from '../dto/create-event-res.dto';

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
  async findAll(
    @CurrentUser('id') userId: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('cursor', new DefaultValuePipe(0), ParseIntPipe) cursor: number,
  ) {
    return this.eventService.findAllEvents({ userId, limit, cursor });
  }
}
