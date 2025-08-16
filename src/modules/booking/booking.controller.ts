import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import { MeetingResDto } from './dto/res/meeting-res.dto';
import { TimeSlotResDto } from './dto/res/time-slots-res.dto';
import { CreateBookingDto } from './dto/req/create-booking.dto';
import { CreateBookingUseCase } from './use-cases/create-booking.use-case';
import { ListTimeSlotsQueryDto } from './dto/res/list-time-slots-query.dto';
import { ListTimeSlotsUseCase } from './use-cases/list-time-slots.use-case';

@Controller('bookings')
export class BookingController {
  constructor(
    private createBookingUC: CreateBookingUseCase,
    private listTimeSlotsUC: ListTimeSlotsUseCase,
  ) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto): Promise<MeetingResDto> {
    return this.createBookingUC.execute(body);
  }

  @Get('time-slots')
  async listTimeSlots(
    @Query() query: ListTimeSlotsQueryDto,
  ): Promise<TimeSlotResDto[]> {
    return this.listTimeSlotsUC.execute(query);
  }
}
