import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';

export function createCursorPaginationResDto<T>(
  ItemClass: new (...args: any[]) => T,
) {
  class CursorPaginationResDto {
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
    @Expose()
    @Type(() => ItemClass)
    @ApiProperty({ type: [ItemClass] })
    items: T[];
  }

  return CursorPaginationResDto;
}
