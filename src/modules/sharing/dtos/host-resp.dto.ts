import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HostRespDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;
}
