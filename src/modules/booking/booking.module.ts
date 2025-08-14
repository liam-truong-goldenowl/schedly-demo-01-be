import { Module } from '@nestjs/common';

import * as UseCases from './use-cases';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  controllers: [BookingController],
  providers: [...Object.values(UseCases), BookingService],
})
export class BookingModule {}
