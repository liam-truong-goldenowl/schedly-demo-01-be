import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsTimeZone,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @ApiProperty({ format: 'email', example: 'johndoe@goldenowl.com' })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @ApiProperty({ format: 'password', example: 'StrongP@ssw0rd!' })
  password: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsTimeZone({
    message: 'Timezone must be a valid IANA timezone.',
  })
  @ApiProperty({ example: 'America/New_York' })
  timezone: string;
}
