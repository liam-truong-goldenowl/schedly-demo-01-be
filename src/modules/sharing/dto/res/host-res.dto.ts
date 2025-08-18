import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HostResDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;
}
