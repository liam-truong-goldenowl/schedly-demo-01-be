import { Expose } from 'class-transformer';

export class BookingRespDto {
  @Expose()
  id: number;
}
