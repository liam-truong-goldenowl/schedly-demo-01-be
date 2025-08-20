import { Type, Expose } from 'class-transformer';

class HostDto {
  @Expose()
  name: string;
}

export class ReadEventDetailsResDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => HostDto)
  host: HostDto;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  duration: number;

  @Expose()
  timezone: string;

  @Expose()
  inviteeLimit: number;
}
