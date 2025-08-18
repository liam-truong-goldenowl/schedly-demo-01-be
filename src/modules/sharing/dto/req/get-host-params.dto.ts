import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetHostParamsDto {
  @IsString()
  @ApiProperty({ example: 'john-doe' })
  userSlug: string;
}
