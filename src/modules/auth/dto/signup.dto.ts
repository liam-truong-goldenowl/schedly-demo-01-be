import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ format: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ format: 'password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ example: 'John Doe' })
  name: string;
}
