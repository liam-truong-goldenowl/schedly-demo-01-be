import { Expose } from 'class-transformer';

export class ListEventSelectResDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}
