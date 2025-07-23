import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the response',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Timestamp when the response was created',
    example: '2023-10-01T00:00:00Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the response was last updated',
    example: '2023-10-01T00:00:00Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
