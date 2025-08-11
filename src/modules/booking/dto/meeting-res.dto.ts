import { Expose } from 'class-transformer';

export class MeetingResDto {
  @Expose()
  id: number;
}
