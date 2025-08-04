import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Body, Post, UseGuards, Controller } from '@nestjs/common';

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
}
