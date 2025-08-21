import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEventsParamsDto {
  @IsString()
  @ApiProperty({ example: 'john-doe' })
  userSlug: string;
}
