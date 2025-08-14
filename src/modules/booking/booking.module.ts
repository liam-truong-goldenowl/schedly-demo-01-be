import { Module } from '@nestjs/common';

import { UtilsModule } from '../utils/utils.module';

import * as UseCases from './use-cases';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingCreatedListener } from './listeners/booking-created.listener';

@Module({
  controllers: [BookingController],
  imports: [UtilsModule],
  providers: [
    ...Object.values(UseCases),
    BookingService,
    BookingCreatedListener,
  ],
})
export class BookingModule {}
