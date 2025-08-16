import { Type, Expose } from 'class-transformer';

class HostDto {
  @Expose()
  name: string;
}

class LocationDto {
  @Expose()
  type: string;

  @Expose()
  details: string;
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
  @Type(() => LocationDto)
  location: LocationDto;

  @Expose()
  timezone: string;
}
