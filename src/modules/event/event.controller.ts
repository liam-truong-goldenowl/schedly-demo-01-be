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

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAccessAuthGuard } from '@/modules/auth/guards/jwt-access-auth.guard';

import { EventResDto } from './dto/res/event-res.dto';
import { CreateEventDto } from './dto/req/create-event.dto';
import { ListEventsResDto } from './dto/res/list-events-res.dto';
import { ListEventsQueryDto } from './dto/req/list-events-query.dto';
import { ListEventsUseCase } from './use-cases/list-events.use-case';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { DeleteEventUseCase } from './use-cases/delete-event.use-case';
import { ReadEventDetailsUseCase } from './use-cases/read-event-details.use-case';

@Controller('events')
export class EventController {
  constructor(
    private listEventsUC: ListEventsUseCase,
    private createEventUC: CreateEventUseCase,
    private deleteEventUC: DeleteEventUseCase,
    private readEventDetailsUC: ReadEventDetailsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(
    @CurrentUser('id') userId: number,
    @Body() body: CreateEventDto,
  ): Promise<EventResDto> {
    return this.createEventUC.execute(userId, body);
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  async findAll(
    @Query() query: ListEventsQueryDto,
    @CurrentUser('id') userId: number,
  ): Promise<ListEventsResDto> {
    return this.listEventsUC.execute(userId, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessAuthGuard)
  async delete(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) eventId: number,
  ) {
    return this.deleteEventUC.execute(userId, eventId);
  }

  @Get(':slug')
  async findOne(@Param('slug') eventSlug: string) {
    return this.readEventDetailsUC.execute(eventSlug);
  }
}
