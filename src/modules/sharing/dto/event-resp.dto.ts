import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EventRespDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'private-english-class' })
  slug: string;

  @Expose()
  @ApiProperty({ example: 'Private English Class' })
  name: string;

  @Expose()
  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Prepare for the next TOEIC test',
  })
  description?: string | null;
}
