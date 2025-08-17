import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EventResDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'coding-tutoring' })
  slug: string;

  @Expose()
  @ApiProperty({ example: 'Team Meeting' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Discuss project updates and next steps',
    required: false,
  })
  description?: string;

  @Expose()
  @ApiProperty({ example: 60 })
  duration: number;

  @Expose()
  @ApiProperty({ example: 10, required: false })
  inviteeLimit: number;

  @Expose()
  @ApiProperty({ example: 1 })
  scheduleId: number;
}
