import { Post, Body, Controller } from '@nestjs/common';

import { BookingRespDto } from '../dto/booking-resp.dto';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CreateBookingUseCase } from '../use-cases/create-booking.use-case';

@Controller('bookings')
export class BookingController {
  constructor(private createBookingUC: CreateBookingUseCase) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto): Promise<BookingRespDto> {
    return this.createBookingUC.execute(body);
  }
}
