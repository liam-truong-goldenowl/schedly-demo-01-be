import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CursorBasedResDto {
  @Expose()
  @ApiProperty({
    example: 'woiy12...',
  })
  nextCursor: string | null;

  @Expose()
  @ApiProperty({
    example: true,
  })
  hasNextPage: boolean;

  @Expose()
  @ApiProperty({
    example: 100,
  })
  totalCount: number;
}
