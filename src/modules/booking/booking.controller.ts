import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import { CreateBookingDto } from './dto';
import {
  ListAvailableMonthDatesQueryDto,
  ListAvailableStartTimesQueryDto,
} from './dto';
import {
  CreateBookingUseCase,
  ListAvailableStartTimeUseCase,
  ListAvailableMonthDatesUseCase,
} from './use-cases';

@Controller('bookings')
export class BookingController {
  constructor(
    private createBookingUC: CreateBookingUseCase,
    private listAvailableStartTimeUC: ListAvailableStartTimeUseCase,
    private listAvailableMonthDatesUC: ListAvailableMonthDatesUseCase,
  ) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto) {
    return this.createBookingUC.execute(body);
  }

  @Get('available-start-times')
  async listAvailableStartTimes(
    @Query() query: ListAvailableStartTimesQueryDto,
  ) {
    return this.listAvailableStartTimeUC.execute({
      eventId: query.eventId,
      dateString: query.date,
      timezone: query.timezone,
    });
  }

  @Get('available-month-dates')
  async listAvailableMonthDates(
    @Query() query: ListAvailableMonthDatesQueryDto,
  ) {
    return this.listAvailableMonthDatesUC.execute({
      eventId: query.eventId,
      monthString: query.month,
      timezone: query.timezone,
    });
  }
}
