import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import { CreateBookingUseCase, ListTimeSlotsUseCase } from './use-cases';
import {
  MeetingResDto,
  TimeSlotResDto,
  CreateBookingDto,
  ListTimeSlotsQueryDto,
} from './dto';

@Controller('bookings')
export class BookingController {
  constructor(
    private createBookingUC: CreateBookingUseCase,
    private listTimeSlotsUC: ListTimeSlotsUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ type: MeetingResDto })
  async createBooking(@Body() body: CreateBookingDto) {
    return this.createBookingUC.execute(body);
  }

  @Get('time-slots')
  @ApiResponse({ type: [TimeSlotResDto] })
  async listAvailableTimeSlots(@Query() query: ListTimeSlotsQueryDto) {
    return this.listTimeSlotsUC.execute(query);
  }
}
