import { Expose } from 'class-transformer';

export class UserProfileResDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}
