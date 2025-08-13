import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import { CreateBookingDto, ListAvailableTimeSlotsQueryDto } from './dto';
import { CreateBookingUseCase, ListTimeSlotsUseCase } from './use-cases';

@Controller('bookings')
export class BookingController {
  constructor(
    private createBookingUC: CreateBookingUseCase,
    private listTimeSlotsUC: ListTimeSlotsUseCase,
  ) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto) {
    return this.createBookingUC.execute(body);
  }

  @Get('time-slots')
  async listAvailableTimeSlots(@Query() query: ListAvailableTimeSlotsQueryDto) {
    return this.listTimeSlotsUC.execute(query);
  }
}
