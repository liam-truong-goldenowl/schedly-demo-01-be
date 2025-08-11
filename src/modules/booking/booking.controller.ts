import { Body, Post, Controller } from '@nestjs/common';

import { CreateBookingDto } from './dto';
import { CreateBookingUseCase } from './use-cases';

@Controller('bookings')
export class BookingController {
  constructor(private createBookingUC: CreateBookingUseCase) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto) {
    return this.createBookingUC.execute(body);
  }
}
